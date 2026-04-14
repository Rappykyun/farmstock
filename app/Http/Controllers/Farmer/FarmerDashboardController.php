<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class FarmerDashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $myProducts = Product::query()
            ->where('farmer_id', $user->id);

        $lowStockProducts = Product::query()
            ->with('unit:id,abbreviation')
            ->where('farmer_id', $user->id)
            ->where('current_stock', '<=', 10)
            ->orderBy('current_stock')
            ->orderBy('name')
            ->take(5)
            ->get();

        $recentInventoryChanges = InventoryLog::query()
            ->with([
                'product:id,name,unit_id',
                'product.unit:id,abbreviation',
            ])
            ->whereHas('product', fn($query) => $query->where('farmer_id', $user->id))
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('farmer/dashboard', [
            'stats' => [
                'my_products' => (clone $myProducts)->count(),
                'low_stock_count' => (clone $myProducts)
                    ->where('current_stock', '<=', 10)
                    ->count(),
                'incoming_orders' => 0,
                'active_products' => (clone $myProducts)
                    ->where('is_active', true)
                    ->count(),
            ],
            'lowStockAlerts' => $lowStockProducts->map(fn(Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'current_stock' => $product->current_stock,
                'unit' => $product->unit?->abbreviation,
                'is_active' => $product->is_active,
            ])->values(),
            'recentInventoryChanges' => $recentInventoryChanges->map(fn(InventoryLog $log) => [
                'id' => $log->id,
                'product_name' => $log->product?->name,
                'unit' => $log->product?->unit?->abbreviation,
                'quantity_change' => $log->quantity_change,
                'quantity_after' => $log->quantity_after,
                'reason' => $log->reason,
                'created_at' => $log->created_at?->toDateTimeString(),
            ])->values(),
        ]);
    }
}
