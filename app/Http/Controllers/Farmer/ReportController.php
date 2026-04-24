<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Models\InventoryLog;
use App\Models\OrderRequest;
use App\Models\OrderRequestItem;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        [$from, $to] = $this->resolveDateRange($request);
        $productId = $request->string('product_id')->toString();

        return Inertia::render('farmer/reports/index', [
            'filters' => [
                'from' => $from,
                'to' => $to,
                'product_id' => $productId,
            ],
            'products' => Product::query()
                ->where('farmer_id', auth()->id())
                ->orderBy('name')
                ->get(['id', 'name']),
            'analytics' => [
                'top_products' => $this->topProducts($from, $to, $productId),
            ],
            'inventorySummary' => $this->inventorySummary($from, $to),
            'orderHistory' => $this->orderHistory($from, $to),
            'stockMovements' => $this->stockMovements($from, $to, $productId),
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        [$from, $to] = $this->resolveDateRange($request);
        $productId = $request->string('product_id')->toString();
        $type = $request->string('type')->toString();

        return match ($type) {
            'inventory' => $this->exportInventoryCsv($from, $to),
            'orders' => $this->exportOrdersCsv($from, $to),
            'stock-movements' => $this->exportStockMovementsCsv($from, $to, $productId),
            default => abort(422, 'Invalid report type.'),
        };
    }

    public function exportPdf(Request $request)
    {
        [$from, $to] = $this->resolveDateRange($request);
        $productId = $request->string('product_id')->toString();

        $pdf = Pdf::loadView('pdf.farmer-stock-movements', [
            'from' => $from,
            'to' => $to,
            'rows' => $this->stockMovements($from, $to, $productId),
        ]);

        return $pdf->download('farmer-stock-movements-report.pdf');
    }

    private function resolveDateRange(Request $request): array
    {
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();

        if ($from === '') {
            $from = now()->subDays(30)->toDateString();
        }

        if ($to === '') {
            $to = now()->toDateString();
        }

        return [$from, $to];
    }

    private function inventorySummary(string $from, string $to)
    {
        return Product::query()
            ->where('farmer_id', auth()->id())
            ->whereBetween('created_at', [$from.' 00:00:00', $to.' 23:59:59'])
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'current_stock' => $product->current_stock,
                'is_active' => $product->is_active,
                'estimated_stock_value' => number_format(
                    (float) $product->price * (float) $product->current_stock,
                    2,
                    '.',
                    '',
                ),
            ]);
    }

    private function orderHistory(string $from, string $to)
    {
        return OrderRequest::query()
            ->with(['status:id,name,slug,color', 'consumer:id,name'])
            ->where('farmer_id', auth()->id())
            ->whereBetween('created_at', [$from.' 00:00:00', $to.' 23:59:59'])
            ->latest()
            ->get()
            ->map(fn (OrderRequest $orderRequest) => [
                'id' => $orderRequest->id,
                'consumer_name' => $orderRequest->consumer?->name,
                'status' => $orderRequest->status?->name,
                'status_slug' => $orderRequest->status?->slug,
                'total_amount' => $orderRequest->total_amount,
                'created_at' => $orderRequest->created_at?->toDateTimeString(),
            ]);
    }

    private function stockMovements(string $from, string $to, string $productId = '')
    {
        return InventoryLog::query()
            ->with(['product:id,name', 'loggedBy:id,name'])
            ->whereHas('product', fn ($query) => $query->where('farmer_id', auth()->id()))
            ->when($productId !== '', fn ($query) => $query->where('product_id', $productId))
            ->whereBetween('created_at', [$from.' 00:00:00', $to.' 23:59:59'])
            ->latest()
            ->get()
            ->map(fn (InventoryLog $log) => [
                'id' => $log->id,
                'product_name' => $log->product?->name,
                'quantity_change' => $log->quantity_change,
                'quantity_after' => $log->quantity_after,
                'reason' => $log->reason,
                'logged_by' => $log->loggedBy?->name,
                'created_at' => $log->created_at?->toDateTimeString(),
            ]);
    }

    private function topProducts(string $from, string $to, string $productId = '')
    {
        return OrderRequestItem::query()
            ->selectRaw('product_id, SUM(quantity) as total_quantity, SUM(subtotal) as total_amount')
            ->with('product:id,name')
            ->when($productId !== '', fn ($query) => $query->where('product_id', $productId))
            ->whereHas('orderRequest', function ($query) use ($from, $to) {
                $query
                    ->where('farmer_id', auth()->id())
                    ->whereBetween('created_at', [$from.' 00:00:00', $to.' 23:59:59']);
            })
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(6)
            ->get()
            ->map(fn (OrderRequestItem $item) => [
                'product_name' => $item->product?->name ?? 'Unknown product',
                'total_quantity' => number_format((float) $item->total_quantity, 2, '.', ''),
                'total_amount' => number_format((float) $item->total_amount, 2, '.', ''),
            ])
            ->values();
    }

    private function exportInventoryCsv(string $from, string $to): StreamedResponse
    {
        $rows = $this->inventorySummary($from, $to);

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Product',
                'Price',
                'Current Stock',
                'Active',
                'Estimated Stock Value',
            ]);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row['name'],
                    $row['price'],
                    $row['current_stock'],
                    $row['is_active'] ? 'Yes' : 'No',
                    $row['estimated_stock_value'],
                ]);
            }

            fclose($handle);
        }, 'farmer-inventory-report.csv');
    }

    private function exportOrdersCsv(string $from, string $to): StreamedResponse
    {
        $rows = $this->orderHistory($from, $to);

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Order ID',
                'Consumer',
                'Status',
                'Total Amount',
                'Created At',
            ]);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row['id'],
                    $row['consumer_name'],
                    $row['status'],
                    $row['total_amount'],
                    $row['created_at'],
                ]);
            }

            fclose($handle);
        }, 'farmer-order-history-report.csv');
    }

    private function exportStockMovementsCsv(string $from, string $to, string $productId = ''): StreamedResponse
    {
        $rows = $this->stockMovements($from, $to, $productId);

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Product',
                'Quantity Change',
                'Quantity After',
                'Reason',
                'Logged By',
                'Created At',
            ]);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row['product_name'],
                    $row['quantity_change'],
                    $row['quantity_after'],
                    $row['reason'],
                    $row['logged_by'],
                    $row['created_at'],
                ]);
            }

            fclose($handle);
        }, 'farmer-stock-movements-report.csv');
    }
}
