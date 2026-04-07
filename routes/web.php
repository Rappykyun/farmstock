<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

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

    Route::inertia('admin/dashboard', 'admin/dashboard')
        ->middleware('role:admin')
        ->name('admin.dashboard');

    Route::inertia('farmer/dashboard', 'farmer/dashboard')
        ->middleware('role:farmer')
        ->name('farmer.dashboard');
});

require __DIR__ . '/settings.php';
