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





Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

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
        Route::inertia('dashboard', 'farmer/dashboard')->name('dashboard');

        Route::resource('products', ProductController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
        Route::post('products/{product}/images', [ProductImageController::class, 'store'])
            ->name('products.images.store');

        Route::delete('products/{product}/images/{productImage}', [ProductImageController::class, 'destroy'])
            ->name('products.images.destroy');
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

});

require __DIR__ . '/settings.php';
