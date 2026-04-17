<?php

namespace App\Http\Controllers\Consumer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Consumer\StoreOrderRequestRequest;
use App\Models\OrderRequest;
use App\Models\Product;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Notifications\NewOrderRequestNotification;
use App\Models\User;

class OrderRequestController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', OrderRequest::class);

        $requests = OrderRequest::query()
            ->with([
                'farmer:id,name,farm_name',
                'status:id,name,color',
                'items.product:id,name',
            ])
            ->where('consumer_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn (OrderRequest $orderRequest) => [
                'id' => $orderRequest->id,
                'farmer_name' => $orderRequest->farmer?->farm_name ?: $orderRequest->farmer?->name,
                'status' => $orderRequest->status?->name,
                'status_color' => $orderRequest->status?->color,
                'total_amount' => $orderRequest->total_amount,
                'notes' => $orderRequest->notes,
                'created_at' => $orderRequest->created_at?->toDateTimeString(),
                'items' => $orderRequest->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product?->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ])->values(),
            ])
            ->values();

        return Inertia::render('orders/index', [
            'requests' => $requests,
        ]);
    }

    public function store(StoreOrderRequestRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('create', OrderRequest::class);

        if (! $product->is_active || (float) $product->current_stock <= 0) {
            throw ValidationException::withMessages([
                'quantity' => 'This product is currently unavailable.',
            ]);
        }

        $quantity = (float) $request->validated()['quantity'];
        $availableStock = (float) $product->current_stock;

        if ($quantity > $availableStock) {
            throw ValidationException::withMessages([
                'quantity' => 'Requested quantity exceeds available stock.',
            ]);
        }

        $pendingStatus = Status::query()
            ->where('type', 'order')
            ->where('slug', 'pending')
            ->first();

        if (! $pendingStatus) {
            throw ValidationException::withMessages([
                'quantity' => 'Order status "pending" is not configured yet.',
            ]);
        }

        $unitPrice = (float) $product->price;
        $subtotal = $quantity * $unitPrice;

        $orderRequest = DB::transaction(function () use ($request, $product, $pendingStatus, $subtotal, $quantity, $unitPrice) {
            $orderRequest = OrderRequest::create([
                'consumer_id' => $request->user()->id,
                'farmer_id' => $product->farmer_id,
                'status_id' => $pendingStatus->id,
                'notes' => $request->validated()['notes'] ?? null,
                'total_amount' => number_format($subtotal, 2, '.', ''),
            ]);

            $orderRequest->items()->create([
                'product_id' => $product->id,
                'quantity' => number_format($quantity, 2, '.', ''),
                'unit_price' => number_format($unitPrice, 2, '.', ''),
                'subtotal' => number_format($subtotal, 2, '.', ''),
            ]);

            return $orderRequest;
        });
$farmer = User::find($product->farmer_id);

$farmer?->notify(new NewOrderRequestNotification($orderRequest));

        return to_route('orders.show', $orderRequest);
    }

    public function show(OrderRequest $orderRequest): Response
    {
        $this->authorize('view', $orderRequest);

        $orderRequest->load([
            'farmer:id,name,farm_name,address,contact_number',
            'status:id,name,color',
            'items.product:id,name,description',
        ]);

        return Inertia::render('orders/show', [
            'request' => [
                'id' => $orderRequest->id,
                'farmer' => [
                    'name' => $orderRequest->farmer?->name,
                    'farm_name' => $orderRequest->farmer?->farm_name,
                    'address' => $orderRequest->farmer?->address,
                    'contact_number' => $orderRequest->farmer?->contact_number,
                ],
                'status' => $orderRequest->status?->name,
                'status_color' => $orderRequest->status?->color,
                'notes' => $orderRequest->notes,
                'total_amount' => $orderRequest->total_amount,
                'created_at' => $orderRequest->created_at?->toDateTimeString(),
                'items' => $orderRequest->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product?->name,
                    'product_description' => $item->product?->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ])->values(),
            ],
        ]);
    }
}
