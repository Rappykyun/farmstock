<?php

use App\Models\User;
use Laravel\Fortify\Features;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->skipUnlessFortifyFeature(Features::registration());

    Role::findOrCreate('admin');
    Role::findOrCreate('farmer');
    Role::findOrCreate('consumer');
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'address' => 'Poblacion, Lebak, Sultan Kudarat',
        'contact_number' => '09123456789',
        'role' => 'consumer',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'test@example.com')->firstOrFail();

    expect($user->hasRole('consumer'))->toBeTrue();
});
