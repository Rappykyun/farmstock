<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\UpdateOrderRequestStatusRequest;
use App\Models\OrderRequest;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Notifications\OrderRequestStatusUpdatedNotification;


class OrderRequestController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', OrderRequest::class);

        $requests = OrderRequest::query()
            ->with([
                'consumer:id,name,email,contact_number',
                'status:id,name,slug,color',
                'items.product:id,name,unit_id',
                'items.product.unit:id,abbreviation',
            ])
            ->where('farmer_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn (OrderRequest $orderRequest) => [
                'id' => $orderRequest->id,
                'consumer_name' => $orderRequest->consumer?->name,
                'consumer_email' => $orderRequest->consumer?->email,
                'consumer_contact' => $orderRequest->consumer?->contact_number,
                'status' => $orderRequest->status?->name,
                'status_slug' => $orderRequest->status?->slug,
                'status_color' => $orderRequest->status?->color,
                'notes' => $orderRequest->notes,
                'rejection_reason' => $orderRequest->rejection_reason,
                'total_amount' => $orderRequest->total_amount,
                'created_at' => $orderRequest->created_at?->toDateTimeString(),
                'items' => $orderRequest->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product?->name,
                    'unit' => $item->product?->unit?->abbreviation,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ])->values(),
            ])
            ->values();

        return Inertia::render('farmer/orders/index', [
            'requests' => $requests,
        ]);
    }

    public function show(OrderRequest $orderRequest): Response
    {
        $this->authorize('view', $orderRequest);

        $orderRequest->load([
            'consumer:id,name,email,contact_number,address',
            'status:id,name,slug,color',
            'items.product:id,name,description,current_stock,unit_id',
            'items.product.unit:id,abbreviation',
        ]);

        return Inertia::render('farmer/orders/show', [
            'request' => [
                'id' => $orderRequest->id,
                'consumer' => [
                    'name' => $orderRequest->consumer?->name,
                    'email' => $orderRequest->consumer?->email,
                    'contact_number' => $orderRequest->consumer?->contact_number,
                    'address' => $orderRequest->consumer?->address,
                ],
                'status' => $orderRequest->status?->name,
                'status_slug' => $orderRequest->status?->slug,
                'status_color' => $orderRequest->status?->color,
                'notes' => $orderRequest->notes,
                'rejection_reason' => $orderRequest->rejection_reason,
                'total_amount' => $orderRequest->total_amount,
                'created_at' => $orderRequest->created_at?->toDateTimeString(),
                'items' => $orderRequest->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name,
                    'product_description' => $item->product?->description,
                    'current_stock' => $item->product?->current_stock,
                    'unit' => $item->product?->unit?->abbreviation,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ])->values(),
            ],
        ]);
    }

    public function update(UpdateOrderRequestStatusRequest $request, OrderRequest $orderRequest): RedirectResponse
    {
        $this->authorize('update', $orderRequest);

        $orderRequest->load([
            'status:id,slug',
            'items.product',
        ]);

        $currentStatus = $orderRequest->status?->slug;
        $validated = $request->validated();
        $nextStatus = $validated['status'];

        $this->ensureValidTransition($currentStatus, $nextStatus);

        $status = Status::query()
            ->where('type', 'order')
            ->where('slug', $nextStatus)
            ->first();

        if (! $status) {
            throw ValidationException::withMessages([
                'status' => 'Target order status is not configured.',
            ]);
        }

        DB::transaction(function () use ($request, $orderRequest, $currentStatus, $nextStatus, $status, $validated): void {
            if ($currentStatus === 'pending' && $nextStatus === 'accepted') {
                foreach ($orderRequest->items as $item) {
                    $product = $item->product;
                    $requestedQuantity = (float) $item->quantity;
                    $currentStock = (float) $product->current_stock;
                    $nextStock = $currentStock - $requestedQuantity;

                    if ($nextStock < 0) {
                        throw ValidationException::withMessages([
                            'status' => "Insufficient stock for {$product->name}.",
                        ]);
                    }

                    $product->update([
                        'current_stock' => number_format($nextStock, 2, '.', ''),
                    ]);

                    $product->inventoryLogs()->create([
                        'quantity_change' => number_format(-$requestedQuantity, 2, '.', ''),
                        'quantity_after' => number_format($nextStock, 2, '.', ''),
                        'reason' => "Order request #{$orderRequest->id} accepted",
                        'logged_by' => $request->user()->id,
                    ]);
                }
            }

            $orderRequest->update([
                'status_id' => $status->id,
                'rejection_reason' => $nextStatus === 'rejected'
                    ? $validated['rejection_reason']
                    : null,
            ]);
        });
        $orderRequest->refresh()->load(['status', 'consumer']);

        $orderRequest->consumer?->notify(
            new OrderRequestStatusUpdatedNotification(
                $orderRequest,
                $orderRequest->status?->name ?? $nextStatus,
                $orderRequest->status?->slug ?? $nextStatus,
                $orderRequest->rejection_reason,
            )
        );


        return to_route('farmer.orders.show', $orderRequest);
    }

    private function ensureValidTransition(?string $currentStatus, string $nextStatus): void
    {
        $allowedTransitions = [
            'pending' => ['accepted', 'rejected'],
            'accepted' => ['completed'],
            'rejected' => [],
            'completed' => [],
        ];

        if (! isset($allowedTransitions[$currentStatus]) || ! in_array($nextStatus, $allowedTransitions[$currentStatus], true)) {
            throw ValidationException::withMessages([
                'status' => 'Invalid order status transition.',
            ]);
        }
    }
}
