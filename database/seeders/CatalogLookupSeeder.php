<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\Status;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class CatalogLookupSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->categories() as $category) {
            ProductCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category,
            );
        }

        foreach ($this->units() as $unit) {
            Unit::updateOrCreate(
                ['abbreviation' => $unit['abbreviation']],
                $unit,
            );
        }

        foreach ($this->statuses() as $status) {
            Status::updateOrCreate(
                ['type' => $status['type'], 'slug' => $status['slug']],
                $status,
            );
        }
    }

    private function categories(): array
    {
        return [
            [
                'name' => 'Fruits',
                'slug' => 'fruits',
                'description' => 'Fresh tropical and seasonal fruits.',
                'is_active' => true,
            ],
            [
                'name' => 'Vegetables',
                'slug' => 'vegetables',
                'description' => 'Leafy greens and everyday cooking vegetables.',
                'is_active' => true,
            ],
            [
                'name' => 'Grains',
                'slug' => 'grains',
                'description' => 'Rice and other grain-based staples.',
                'is_active' => true,
            ],
            [
                'name' => 'Root Crops',
                'slug' => 'root-crops',
                'description' => 'Underground produce commonly sold by weight.',
                'is_active' => true,
            ],
            [
                'name' => 'Herbs & Spices',
                'slug' => 'herbs-spices',
                'description' => 'Flavoring ingredients for home and market use.',
                'is_active' => true,
            ],
        ];
    }

    private function units(): array
    {
        return [
            [
                'name' => 'Kilogram',
                'abbreviation' => 'kg',
                'description' => 'Sold by kilogram.',
                'is_active' => true,
            ],
            [
                'name' => 'Gram',
                'abbreviation' => 'g',
                'description' => 'Sold by gram.',
                'is_active' => true,
            ],
            [
                'name' => 'Piece',
                'abbreviation' => 'pc',
                'description' => 'Sold per piece.',
                'is_active' => true,
            ],
            [
                'name' => 'Bunch',
                'abbreviation' => 'bunch',
                'description' => 'Sold per bunch.',
                'is_active' => true,
            ],
            [
                'name' => 'Sack',
                'abbreviation' => 'sack',
                'description' => 'Sold per sack.',
                'is_active' => true,
            ],
            [
                'name' => 'Tray',
                'abbreviation' => 'tray',
                'description' => 'Sold per tray.',
                'is_active' => true,
            ],
        ];
    }

    private function statuses(): array
    {
        return [
            [
                'name' => 'Fresh',
                'slug' => 'fresh',
                'type' => 'product',
                'color' => '#22C55E',
                'description' => 'Freshly harvested and ready for sale.',
                'is_active' => true,
            ],
            [
                'name' => 'Good',
                'slug' => 'good',
                'type' => 'product',
                'color' => '#84CC16',
                'description' => 'Good quality produce for regular sale.',
                'is_active' => true,
            ],
            [
                'name' => 'Premium',
                'slug' => 'premium',
                'type' => 'product',
                'color' => '#F59E0B',
                'description' => 'Premium quality produce.',
                'is_active' => true,
            ],
            [
                'name' => 'Seasonal',
                'slug' => 'seasonal',
                'type' => 'product',
                'color' => '#FB923C',
                'description' => 'Available during seasonal harvest periods.',
                'is_active' => true,
            ],
            [
                'name' => 'Pending',
                'slug' => 'pending',
                'type' => 'order',
                'color' => '#F59E0B',
                'description' => 'Awaiting farmer review.',
                'is_active' => true,
            ],
            [
                'name' => 'Accepted',
                'slug' => 'accepted',
                'type' => 'order',
                'color' => '#22C55E',
                'description' => 'Accepted by the farmer.',
                'is_active' => true,
            ],
            [
                'name' => 'Rejected',
                'slug' => 'rejected',
                'type' => 'order',
                'color' => '#EF4444',
                'description' => 'Rejected by the farmer.',
                'is_active' => true,
            ],
            [
                'name' => 'Completed',
                'slug' => 'completed',
                'type' => 'order',
                'color' => '#3B82F6',
                'description' => 'Completed and fulfilled.',
                'is_active' => true,
            ],
            [
                'name' => 'In Stock',
                'slug' => 'in-stock',
                'type' => 'inventory',
                'color' => '#22C55E',
                'description' => 'Inventory is available.',
                'is_active' => true,
            ],
            [
                'name' => 'Low Stock',
                'slug' => 'low-stock',
                'type' => 'inventory',
                'color' => '#F59E0B',
                'description' => 'Inventory is low and needs restocking.',
                'is_active' => true,
            ],
            [
                'name' => 'Out of Stock',
                'slug' => 'out-of-stock',
                'type' => 'inventory',
                'color' => '#EF4444',
                'description' => 'Inventory is depleted.',
                'is_active' => true,
            ],
        ];
    }
}
