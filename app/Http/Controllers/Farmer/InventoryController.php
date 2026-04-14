<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\UpdateInventoryRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->with([
                'unit:id,name,abbreviation',
                'inventoryLogs' => fn($query) => $query
                    ->with('loggedBy:id,name')
                    ->latest()
                    ->limit(10),
            ])
            ->where('farmer_id', auth()->id())
            ->orderBy('name')
            ->get();

        return Inertia::render('farmer/inventory/index', [
            'products' => $products->map(fn(Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'current_stock' => $product->current_stock,
                'unit' => $product->unit?->abbreviation,
                'is_active' => $product->is_active,
                'updated_at' => $product->updated_at?->toDateTimeString(),
                'history' => $product->inventoryLogs->map(fn($log) => [
                    'id' => $log->id,
                    'quantity_change' => $log->quantity_change,
                    'quantity_after' => $log->quantity_after,
                    'reason' => $log->reason,
                    'logged_by' => $log->loggedBy?->name,
                    'created_at' => $log->created_at?->toDateTimeString(),
                ])->values(),
            ])->values(),
        ]);
    }

    public function update(UpdateInventoryRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $data = $request->validated();
        $quantity = (float) $data['quantity'];
        $change = $data['action'] === 'subtract' ? -$quantity : $quantity;
        $currentStock = (float) $product->current_stock;
        $nextStock = $currentStock + $change;

        if ($nextStock < 0) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity exceeds the current stock.',
            ]);
        }

        DB::transaction(function () use ($request, $product, $change, $nextStock, $data): void {
            $product->update([
                'current_stock' => number_format($nextStock, 2, '.', ''),
            ]);

            $product->inventoryLogs()->create([
                'quantity_change' => number_format($change, 2, '.', ''),
                'quantity_after' => number_format($nextStock, 2, '.', ''),
                'reason' => $data['reason'],
                'logged_by' => $request->user()->id,
            ]);
        });

        return to_route('farmer.inventory.index');
    }
}
