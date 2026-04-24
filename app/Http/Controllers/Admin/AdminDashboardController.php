<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $adminUsers = User::role('admin')->count();
        $farmerUsers = User::role('farmer')->count();
        $consumerUsers = User::role('consumer')->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'admin_users' => $adminUsers,
                'farmer_users' => $farmerUsers,
                'consumer_users' => $consumerUsers,
                'total_products' => Product::count(),
                'pending_orders' => OrderRequest::query()
                    ->whereHas('status', fn ($query) => $query->where('slug', 'pending'))
                    ->count(),
                'total_categories' => ProductCategory::count(),
                'total_units' => Unit::count(),
                'total_statuses' => Status::count(),
            ],
            'recentActivity' => $this->recentActivity(),
            'orderVolume' => $this->orderVolume(),
            'userBreakdown' => [
                ['role' => 'Admins', 'total' => $adminUsers],
                ['role' => 'Farmers', 'total' => $farmerUsers],
                ['role' => 'Consumers', 'total' => $consumerUsers],
            ],
            'catalogBreakdown' => [
                ['label' => 'Products', 'total' => Product::count()],
                ['label' => 'Categories', 'total' => ProductCategory::count()],
                ['label' => 'Units', 'total' => Unit::count()],
                ['label' => 'Statuses', 'total' => Status::count()],
            ],
        ]);
    }

    private function recentActivity(): array
    {
        return collect()
            ->concat(
                User::query()
                    ->latest()
                    ->take(4)
                    ->get()
                    ->map(fn(User $user) => [
                        'title' => 'New user registered',
                        'description' => "{$user->name} joined as " . ($user->getRoleNames()->first() ?? 'unassigned'),
                        'timestamp' => $user->created_at,
                    ])
            )
            ->concat(
                ProductCategory::query()
                    ->latest()
                    ->take(3)
                    ->get()
                    ->map(fn(ProductCategory $category) => [
                        'title' => 'Category created',
                        'description' => $category->name,
                        'timestamp' => $category->created_at,
                    ])
            )
            ->concat(
                Unit::query()
                    ->latest()
                    ->take(3)
                    ->get()
                    ->map(fn(Unit $unit) => [
                        'title' => 'Unit created',
                        'description' => "{$unit->name} ({$unit->abbreviation})",
                        'timestamp' => $unit->created_at,
                    ])
            )
            ->concat(
                Status::query()
                    ->latest()
                    ->take(3)
                    ->get()
                    ->map(fn(Status $status) => [
                        'title' => 'Status created',
                        'description' => "{$status->name} [{$status->type}]",
                        'timestamp' => $status->created_at,
                    ])
            )
            ->sortByDesc('timestamp')
            ->take(6)
            ->values()
            ->map(fn(array $item) => [
                'title' => $item['title'],
                'description' => $item['description'],
                'time' => $item['timestamp'] instanceof Carbon
                    ? $item['timestamp']->diffForHumans()
                    : null,
            ])
            ->all();
    }

    private function orderVolume(): array
    {
        $dailyOrders = OrderRequest::query()
            ->selectRaw('DATE(created_at) as report_date, COUNT(*) as orders')
            ->whereBetween('created_at', [
                now()->subDays(6)->startOfDay(),
                now()->endOfDay(),
            ])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->pluck('orders', 'report_date');

        return collect(range(6, 0))
            ->map(fn(int $offset) => [
                'date' => now()->subDays($offset)->toDateString(),
                'orders' => (int) ($dailyOrders[now()->subDays($offset)->toDateString()] ?? 0),
            ])
            ->all();
    }
}
