<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\StatusController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Farmer\ProductController;
use App\Http\Controllers\Farmer\ProductImageController;
use App\Http\Controllers\Farmer\InventoryController;
use App\Http\Controllers\Farmer\FarmerDashboardController;
use App\Http\Controllers\Consumer\ProductBrowseController;
use App\Http\Controllers\Consumer\OrderRequestController;
use App\Http\Controllers\Farmer\OrderRequestController as FarmerOrderRequestController;
use App\Http\Controllers\Consumer\ConsumerDashboardController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Farmer\ReportController as FarmerReportController;
use App\Http\Controllers\Admin\ActivityMonitorController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\NotificationController;



Route::get('/', LandingPageController::class)->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [ConsumerDashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('products', [ProductBrowseController::class, 'index'])
        ->name('products.index');

    Route::get('products/{product}', [ProductBrowseController::class, 'show'])
        ->name('products.show');

    Route::get('notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.read');

    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.read-all');


    Route::get('admin/dashboard', [AdminDashboardController::class, 'index'])
        ->middleware('role:admin')
        ->name('admin.dashboard');


    Route::prefix('farmer')->name('farmer.')->middleware('role:farmer')->group(function () {

        Route::get('dashboard', [FarmerDashboardController::class, 'index'])
            ->name('dashboard');

        Route::resource('products', ProductController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);

        Route::post('products/{product}/images', [ProductImageController::class, 'store'])
            ->name('products.images.store');

        Route::delete('products/{product}/images/{productImage}', [ProductImageController::class, 'destroy'])
            ->name('products.images.destroy');

        Route::get('inventory', [InventoryController::class, 'index'])
            ->name('inventory.index');

        Route::patch('products/{product}/inventory', [InventoryController::class, 'update'])
            ->name('products.inventory.update');

        Route::get('orders', [FarmerOrderRequestController::class, 'index'])
            ->name('orders.index');

        Route::get('orders/{orderRequest}', [FarmerOrderRequestController::class, 'show'])
            ->name('orders.show');

        Route::patch('orders/{orderRequest}', [FarmerOrderRequestController::class, 'update'])
            ->name('orders.update');

        Route::get('reports', [FarmerReportController::class, 'index'])
            ->name('reports.index');

        Route::get('reports/export/csv', [FarmerReportController::class, 'exportCsv'])
            ->name('reports.export.csv');

        Route::get('reports/export/pdf', [FarmerReportController::class, 'exportPdf'])
            ->name('reports.export.pdf');

    });


    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::resource('product-categories', ProductCategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('units', UnitController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('statuses', StatusController::class)
            ->only(['index', 'store', 'update', 'destroy']);
        Route::resource('users', UserController::class)
            ->only(['index', 'update']);

        Route::get('reports', [ReportController::class, 'index'])
            ->name('reports.index');

        Route::get('reports/export', [ReportController::class, 'export'])
            ->name('reports.export');

        Route::get('activity', [ActivityMonitorController::class, 'index'])
            ->name('activity.index');

        Route::get('settings', [SettingsController::class, 'index'])
            ->name('settings.index');

        Route::patch('settings', [SettingsController::class, 'update'])
            ->name('settings.update');



    });

    Route::middleware(['auth', 'role:consumer'])->group(function () {
    Route::get('orders', [OrderRequestController::class, 'index'])
        ->name('orders.index');

    Route::post('products/{product}/order-requests', [OrderRequestController::class, 'store'])
        ->middleware('throttle:order-requests')
        ->name('products.order-requests.store');

    Route::get('orders/{orderRequest}', [OrderRequestController::class, 'show'])
        ->name('orders.show');
});


});

require __DIR__ . '/settings.php';
