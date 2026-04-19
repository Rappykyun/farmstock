<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['admin', 'farmer', 'consumer'] as $roleName) {
            Role::findOrCreate($roleName);
        }

        $admin = User::updateOrCreate(
            ['email' => 'admin@farmstock.test'],
            [
                'name' => 'FarmStock Admin',
                'password' => 'password',
                'address' => 'Municipal Hall Compound, Isulan',
                'contact_number' => '09170000001',
                'is_active' => true,
            ],
        );
        $admin->syncRoles(['admin']);

        foreach ($this->farmers() as $farmerData) {
            $farmer = User::updateOrCreate(
                ['email' => $farmerData['email']],
                $farmerData,
            );
            $farmer->syncRoles(['farmer']);
        }

        foreach ($this->consumers() as $consumerData) {
            $consumer = User::updateOrCreate(
                ['email' => $consumerData['email']],
                $consumerData,
            );
            $consumer->syncRoles(['consumer']);
        }
    }

    private function farmers(): array
    {
        return [
            [
                'name' => 'Maria Santos',
                'email' => 'maria@farmstock.test',
                'password' => 'password',
                'address' => 'Purok Mabuhay, Isulan, Sultan Kudarat',
                'contact_number' => '09170000002',
                'farm_name' => 'Green Valley Farm',
                'farm_details' => 'Mixed fruit and vegetable farm supplying local buyers.',
                'is_active' => true,
            ],
            [
                'name' => 'Joel Dela Cruz',
                'email' => 'joel@farmstock.test',
                'password' => 'password',
                'address' => 'Barangay Kalawag 2, Isulan, Sultan Kudarat',
                'contact_number' => '09170000003',
                'farm_name' => 'Sunrise Harvest Farm',
                'farm_details' => 'Produces grains and seasonal market vegetables.',
                'is_active' => true,
            ],
        ];
    }

    private function consumers(): array
    {
        return [
            [
                'name' => 'Aira Mendoza',
                'email' => 'aira@farmstock.test',
                'password' => 'password',
                'address' => 'National Highway, Tacurong City',
                'contact_number' => '09170000004',
                'is_active' => true,
            ],
            [
                'name' => 'Carlo Ramos',
                'email' => 'carlo@farmstock.test',
                'password' => 'password',
                'address' => 'Poblacion, Isulan, Sultan Kudarat',
                'contact_number' => '09170000005',
                'is_active' => true,
            ],
            [
                'name' => 'Diane Flores',
                'email' => 'diane@farmstock.test',
                'password' => 'password',
                'address' => 'Lambayong, Sultan Kudarat',
                'contact_number' => '09170000006',
                'is_active' => true,
            ],
        ];
    }
}
