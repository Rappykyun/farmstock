<?php

use Illuminate\Http\Request;
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



Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('products', [ProductBrowseController::class, 'index'])
    ->name('products.index');

Route::get('products/{product}', [ProductBrowseController::class, 'show'])
    ->name('products.show');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            return to_route('admin.dashboard');
        }

        if ($user->hasRole('farmer')) {
            return to_route('farmer.dashboard');
        }

        abort_unless($user->hasRole('consumer'), 403);

        return Inertia::render('dashboard');
    })->name('dashboard');

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

    });

    Route::middleware(['auth', 'verified', 'role:consumer'])->group(function () {
    Route::get('orders', [OrderRequestController::class, 'index'])
        ->name('orders.index');

    Route::post('products/{product}/order-requests', [OrderRequestController::class, 'store'])
        ->name('products.order-requests.store');

    Route::get('orders/{orderRequest}', [OrderRequestController::class, 'show'])
        ->name('orders.show');
});


});

require __DIR__ . '/settings.php';
