<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\StoreProductImageRequest;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class ProductImageController extends Controller
{
    public function store(StoreProductImageRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $disk = Storage::disk('products');

        $disk->makeDirectory((string) $product->id);
        $disk->makeDirectory($product->id . '/thumbnails');

        $nextSortOrder = ((int) $product->images()->max('sort_order')) + 1;
        $hasPrimaryImage = $product->images()->where('is_primary', true)->exists();

        foreach ($request->file('images') as $index => $upload) {
            $extension = strtolower($upload->getClientOriginalExtension());
            $filename = Str::uuid() . '.' . $extension;

            $path = $product->id . '/' . $filename;
            $thumbnailPath = $this->thumbnailPath($path);

            $disk->put($path, file_get_contents($upload->getRealPath()));

            Image::read($upload)
                ->scaleDown(width: 600)
                ->save($disk->path($thumbnailPath), quality: 80);

            $product->images()->create([
                'path' => $path,
                'is_primary' => !$hasPrimaryImage && $index === 0,
                'sort_order' => $nextSortOrder + $index,
            ]);
        }

        return back();
    }

    public function destroy(Product $product, ProductImage $productImage): RedirectResponse
    {
        $this->authorize('update', $product);

        abort_unless($productImage->product_id === $product->id, 404);

        $disk = Storage::disk('products');
        $wasPrimary = $productImage->is_primary;

        $disk->delete($productImage->path);
        $disk->delete($this->thumbnailPath($productImage->path));

        $productImage->delete();

        if ($wasPrimary) {
            $product->images()
                ->orderBy('sort_order')
                ->first()?->update(['is_primary' => true]);
        }

        return back();
    }

    private function thumbnailPath(string $path): string
    {
        return dirname($path) . '/thumbnails/' . basename($path);
    }
}
