<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::findOrCreate('admin');
    Role::findOrCreate('farmer');
    Role::findOrCreate('consumer');
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));

    $response->assertRedirect(route('login'));
});

test('consumer users can visit the dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('consumer');

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
});

test('admin users are redirected to the admin dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('admin.dashboard'));
});

test('farmer users are redirected to the farmer dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('farmer');

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('farmer.dashboard'));
});
