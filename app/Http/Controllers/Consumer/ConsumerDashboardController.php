<?php

namespace App\Http\Controllers\Consumer;

use App\Http\Controllers\Controller;
use App\Models\OrderRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ConsumerDashboardController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return to_route('admin.dashboard');
        }

        if ($user->hasRole('farmer')) {
            return to_route('farmer.dashboard');
        }

        abort_unless($user->hasRole('consumer'), 403);

        $recentRequests = OrderRequest::query()
            ->with([
                'farmer:id,name,farm_name',
                'status:id,name,slug,color',
                'items.product:id,name',
            ])
            ->where('consumer_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $recentProducts = Product::query()
            ->with([
                'category:id,name',
                'farmer:id,name,farm_name',
                'images',
            ])
            ->where('is_active', true)
            ->where('current_stock', '>', 0)
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_requests' => OrderRequest::query()
                    ->where('consumer_id', $user->id)
                    ->count(),
                'pending_requests' => OrderRequest::query()
                    ->where('consumer_id', $user->id)
                    ->whereHas('status', fn ($query) => $query->where('slug', 'pending'))
                    ->count(),
                'accepted_requests' => OrderRequest::query()
                    ->where('consumer_id', $user->id)
                    ->whereHas('status', fn ($query) => $query->where('slug', 'accepted'))
                    ->count(),
            ],
            'recentRequests' => $recentRequests->map(fn (OrderRequest $orderRequest) => [
                'id' => $orderRequest->id,
                'farmer_name' => $orderRequest->farmer?->farm_name ?: $orderRequest->farmer?->name,
                'status' => $orderRequest->status?->name,
                'status_slug' => $orderRequest->status?->slug,
                'status_color' => $orderRequest->status?->color,
                'total_amount' => $orderRequest->total_amount,
                'created_at' => $orderRequest->created_at?->toDateTimeString(),
                'item_count' => $orderRequest->items->count(),
            ])->values(),
            'featuredProducts' => $recentProducts->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'current_stock' => $product->current_stock,
                'category' => $product->category?->name,
                'farmer_name' => $product->farmer?->farm_name ?: $product->farmer?->name,
                'image' => $product->images->first()
                    ? Storage::disk('products')->url($product->images->first()->path)
                    : null,
            ])->values(),
        ]);
    }
}
