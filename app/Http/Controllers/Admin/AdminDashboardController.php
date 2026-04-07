<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'admin_users' => User::role('admin')->count(),
                'farmer_users' => User::role('farmer')->count(),
                'consumer_users' => User::role('consumer')->count(),
                'total_products' => class_exists(\App\Models\Product::class)
                    ? \App\Models\Product::query()->count()
                    : 0,
                'pending_orders' => 0,
                'total_categories' => ProductCategory::count(),
                'total_units' => Unit::count(),
                'total_statuses' => Status::count(),
            ],
            'recentActivity' => $this->recentActivity(),
            'orderVolume' => $this->orderVolume(),
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
        return collect(range(6, 0))
            ->map(fn(int $offset) => [
                'date' => now()->subDays($offset)->format('M d'),
                'orders' => 0,
            ])
            ->all();
    }
}
