<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Status;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $disk = Storage::disk('products');

        foreach ($disk->directories() as $directory) {
            $disk->deleteDirectory($directory);
        }

        foreach ($disk->files() as $file) {
            $disk->delete($file);
        }

        foreach ($this->products() as $payload) {
            $farmer = User::where('email', $payload['farmer_email'])->firstOrFail();
            $category = ProductCategory::where('slug', $payload['category_slug'])->firstOrFail();
            $unit = Unit::where('abbreviation', $payload['unit'])->firstOrFail();
            $status = Status::where('type', 'product')
                ->where('slug', $payload['status_slug'])
                ->firstOrFail();

            $product = Product::updateOrCreate(
                ['farmer_id' => $farmer->id, 'name' => $payload['name']],
                [
                    'category_id' => $category->id,
                    'unit_id' => $unit->id,
                    'status_id' => $status->id,
                    'description' => $payload['description'],
                    'price' => number_format($payload['price'], 2, '.', ''),
                    'current_stock' => number_format($payload['stock'], 2, '.', ''),
                    'is_active' => true,
                ],
            );

            $this->seedImage($product, $payload['asset']);
            $this->seedInitialInventory($product, $farmer->id, $payload['stock']);
        }
    }

    private function products(): array
    {
        return [
            [
                'farmer_email' => 'maria@farmstock.test',
                'name' => 'Lakatan Bananas',
                'description' => 'Sweet ripe bananas harvested for household and retail buyers.',
                'category_slug' => 'fruits',
                'unit' => 'kg',
                'status_slug' => 'fresh',
                'price' => 120,
                'stock' => 48,
                'asset' => 'bananas.jpg',
            ],
            [
                'farmer_email' => 'maria@farmstock.test',
                'name' => 'Heirloom Tomatoes',
                'description' => 'Fresh tomatoes suitable for daily cooking and market stalls.',
                'category_slug' => 'vegetables',
                'unit' => 'kg',
                'status_slug' => 'fresh',
                'price' => 95,
                'stock' => 36,
                'asset' => 'tomatoes.jpg',
            ],
            [
                'farmer_email' => 'maria@farmstock.test',
                'name' => 'Carabao Mangoes',
                'description' => 'Premium mangoes with a sweet finish and bright yellow flesh.',
                'category_slug' => 'fruits',
                'unit' => 'kg',
                'status_slug' => 'premium',
                'price' => 180,
                'stock' => 22,
                'asset' => 'mango.jpg',
            ],
            [
                'farmer_email' => 'joel@farmstock.test',
                'name' => 'Glutinous Rice',
                'description' => 'Locally milled sticky rice packed for households and resellers.',
                'category_slug' => 'grains',
                'unit' => 'sack',
                'status_slug' => 'good',
                'price' => 2500,
                'stock' => 14,
                'asset' => 'rice.jpg',
            ],
            [
                'farmer_email' => 'joel@farmstock.test',
                'name' => 'Fresh Carrots',
                'description' => 'Firm orange carrots cleaned and ready for kitchen use.',
                'category_slug' => 'root-crops',
                'unit' => 'kg',
                'status_slug' => 'fresh',
                'price' => 85,
                'stock' => 30,
                'asset' => 'carrots.jpg',
            ],
            [
                'farmer_email' => 'joel@farmstock.test',
                'name' => 'Eggplant',
                'description' => 'Fresh eggplant harvested for grilling, sautéing, and local retail.',
                'category_slug' => 'vegetables',
                'unit' => 'kg',
                'status_slug' => 'good',
                'price' => 70,
                'stock' => 26,
                'asset' => 'eggplant.jpg',
            ],
        ];
    }

    private function seedImage(Product $product, string $assetFileName): void
    {
        $disk = Storage::disk('products');
        $source = database_path('seeders/assets/products/' . $assetFileName);

        if (! file_exists($source)) {
            throw new \RuntimeException("Missing product seed image: {$assetFileName}");
        }

        $relativePath = $product->id . '/' . $assetFileName;
        $thumbnailPath = $product->id . '/thumbnails/' . $assetFileName;

        $disk->makeDirectory((string) $product->id);
        $disk->makeDirectory($product->id . '/thumbnails');
        $disk->put($relativePath, file_get_contents($source));
        $disk->put($thumbnailPath, file_get_contents($source));

        $product->images()->updateOrCreate(
            ['path' => $relativePath],
            [
                'is_primary' => true,
                'sort_order' => 1,
            ],
        );
    }

    private function seedInitialInventory(Product $product, int $loggedBy, float $stock): void
    {
        $product->inventoryLogs()->updateOrCreate(
            ['product_id' => $product->id, 'reason' => 'Initial stock seed'],
            [
                'quantity_change' => number_format($stock, 2, '.', ''),
                'quantity_after' => number_format($stock, 2, '.', ''),
                'logged_by' => $loggedBy,
            ],
        );
    }
}
