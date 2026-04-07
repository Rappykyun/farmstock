<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Role::findOrCreate('admin');
        Role::findOrCreate('farmer');
        Role::findOrCreate('consumer');

        $admin = User::updateOrCreate(
            ['email' => 'admin@farmstock.test'],
            [
                'name' => 'Farmstock Admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $admin->assignRole('admin');
    }
}
