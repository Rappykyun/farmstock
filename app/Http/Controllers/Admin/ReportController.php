<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderRequest;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        [$from, $to] = $this->resolveDateRange($request);

        return Inertia::render('admin/reports/index', [
            'filters' => [
                'from' => $from,
                'to' => $to,
            ],
            'userStats' => [
                'total_users' => User::count(),
                'active_users' => User::query()->where('is_active', true)->count(),
                'admin_users' => User::role('admin')->count(),
                'farmer_users' => User::role('farmer')->count(),
                'consumer_users' => User::role('consumer')->count(),
            ],
            'analytics' => [
                'user_role_breakdown' => $this->userRoleBreakdown(),
                'user_status_breakdown' => $this->userStatusBreakdown(),
                'top_farmers_by_value' => $this->topFarmersByValue($from, $to),
                'top_farmers_by_products' => $this->topFarmersByProducts($from, $to),
            ],
            'inventorySummary' => $this->inventorySummary($from, $to),
            'orderVolume' => $this->orderVolume($from, $to),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        [$from, $to] = $this->resolveDateRange($request);

        $type = $request->string('type')->toString();

        return match ($type) {
            'users' => $this->exportUsersCsv(),
            'inventory' => $this->exportInventoryCsv($from, $to),
            'orders' => $this->exportOrdersCsv($from, $to),
            default => abort(422, 'Invalid report type.'),
        };
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
            ->join('users', 'users.id', '=', 'products.farmer_id')
            ->whereBetween('products.created_at', [$from.' 00:00:00', $to.' 23:59:59'])
            ->selectRaw('
                users.id as farmer_id,
                COALESCE(users.farm_name, users.name) as farmer_name,
                COUNT(products.id) as product_count,
                SUM(CASE WHEN products.is_active = 1 THEN 1 ELSE 0 END) as active_products,
                SUM(products.current_stock) as total_stock_units,
                SUM(products.price * products.current_stock) as estimated_stock_value
            ')
            ->groupBy('users.id', 'users.farm_name', 'users.name')
            ->orderBy('farmer_name')
            ->get()
            ->map(fn ($row) => [
                'farmer_id' => $row->farmer_id,
                'farmer_name' => $row->farmer_name,
                'product_count' => (int) $row->product_count,
                'active_products' => (int) $row->active_products,
                'total_stock_units' => number_format((float) $row->total_stock_units, 2, '.', ''),
                'estimated_stock_value' => number_format((float) $row->estimated_stock_value, 2, '.', ''),
            ]);
    }

    private function orderVolume(string $from, string $to)
    {
        return OrderRequest::query()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as request_count, SUM(total_amount) as total_amount')
            ->whereBetween('created_at', [$from.' 00:00:00', $to.' 23:59:59'])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'request_count' => (int) $row->request_count,
                'total_amount' => number_format((float) $row->total_amount, 2, '.', ''),
            ]);
    }

    private function userRoleBreakdown(): array
    {
        return [
            [
                'role' => 'Admins',
                'total' => User::role('admin')->count(),
            ],
            [
                'role' => 'Farmers',
                'total' => User::role('farmer')->count(),
            ],
            [
                'role' => 'Consumers',
                'total' => User::role('consumer')->count(),
            ],
        ];
    }

    private function userStatusBreakdown(): array
    {
        return [
            [
                'role' => 'Admins',
                'active' => User::role('admin')->where('is_active', true)->count(),
                'inactive' => User::role('admin')->where('is_active', false)->count(),
            ],
            [
                'role' => 'Farmers',
                'active' => User::role('farmer')->where('is_active', true)->count(),
                'inactive' => User::role('farmer')->where('is_active', false)->count(),
            ],
            [
                'role' => 'Consumers',
                'active' => User::role('consumer')->where('is_active', true)->count(),
                'inactive' => User::role('consumer')->where('is_active', false)->count(),
            ],
        ];
    }

    private function topFarmersByValue(string $from, string $to)
    {
        return $this->inventorySummary($from, $to)
            ->sortByDesc(fn (array $row) => (float) $row['estimated_stock_value'])
            ->take(6)
            ->values()
            ->map(fn (array $row) => [
                'farmer_name' => $row['farmer_name'],
                'estimated_stock_value' => $row['estimated_stock_value'],
            ])
            ->all();
    }

    private function topFarmersByProducts(string $from, string $to)
    {
        return $this->inventorySummary($from, $to)
            ->sortByDesc('product_count')
            ->take(6)
            ->values()
            ->map(fn (array $row) => [
                'farmer_name' => $row['farmer_name'],
                'product_count' => $row['product_count'],
                'active_products' => $row['active_products'],
            ])
            ->all();
    }

    private function exportUsersCsv(): StreamedResponse
    {
        $users = User::query()
            ->with('roles:id,name')
            ->orderBy('name')
            ->get();

        return response()->streamDownload(function () use ($users) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['ID', 'Name', 'Email', 'Role', 'Active']);

            foreach ($users as $user) {
                fputcsv($handle, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->getRoleNames()->first(),
                    $user->is_active ? 'Yes' : 'No',
                ]);
            }

            fclose($handle);
        }, 'admin-users-report.csv');
    }

    private function exportInventoryCsv(string $from, string $to): StreamedResponse
    {
        $rows = $this->inventorySummary($from, $to);

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'Farmer',
                'Product Count',
                'Active Products',
                'Total Stock Units',
                'Estimated Stock Value',
            ]);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row['farmer_name'],
                    $row['product_count'],
                    $row['active_products'],
                    $row['total_stock_units'],
                    $row['estimated_stock_value'],
                ]);
            }

            fclose($handle);
        }, 'admin-inventory-report.csv');
    }

    private function exportOrdersCsv(string $from, string $to): StreamedResponse
    {
        $rows = $this->orderVolume($from, $to);

        return response()->streamDownload(function () use ($rows) {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Date', 'Request Count', 'Total Amount']);

            foreach ($rows as $row) {
                fputcsv($handle, [
                    $row['date'],
                    $row['request_count'],
                    $row['total_amount'],
                ]);
            }

            fclose($handle);
        }, 'admin-orders-report.csv');
    }
}
