<?php

namespace App\Http\Controllers\Farmer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Farmer\StoreProductRequest;
use App\Http\Requests\Farmer\UpdateProductRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Status;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Product::class);

        return Inertia::render('farmer/products/index', [
            'products' => Product::query()
                ->with(['category', 'unit', 'status'])
                ->where('farmer_id', auth()->id())
                ->latest()
                ->get()
                ->map(fn(Product $product) => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category?->name,
                    'unit' => $product->unit?->abbreviation,
                    'status' => $product->status?->name,
                    'price' => $product->price,
                    'is_active' => $product->is_active,
                    'created_at' => $product->created_at?->toDateTimeString(),
                ]),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('farmer/products/create', [
            'categories' => ProductCategory::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
            'units' => Unit::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'abbreviation']),
            'statuses' => Status::query()
                ->where('type', 'product')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'color']),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->authorize('create', Product::class);

        $product = Product::create([
            ...$request->validated(),
            'farmer_id' => $request->user()->id,
        ]);

        return to_route('farmer.products.edit', $product);
    }


    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        return Inertia::render('farmer/products/edit', [
            'product' => [
                'id' => $product->id,
                'category_id' => $product->category_id,
                'unit_id' => $product->unit_id,
                'status_id' => $product->status_id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'is_active' => $product->is_active,
                'images' => $product->images
                    ->map(fn ($image) => [
                        'id' => $image->id,
                        'path' => $image->path,
                        'is_primary' => $image->is_primary,
                        'sort_order' => $image->sort_order,
                        'url' => Storage::disk('products')->url($image->path),
                        'thumbnail_url' => $this->productImageThumbnailUrl($image->path),
                    ])
                    ->values(),
            ],
            'categories' => ProductCategory::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
            'units' => Unit::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'abbreviation']),
            'statuses' => Status::query()
                ->where('type', 'product')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'color']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $product->update($request->validated());

        return to_route('farmer.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return to_route('farmer.products.index');
    }

    private function productImageThumbnailUrl(string $path): string
    {
        $disk = Storage::disk('products');
        $thumbnailPath = dirname($path).'/thumbnails/'.basename($path);

        return $disk->exists($thumbnailPath)
            ? $disk->url($thumbnailPath)
            : $disk->url($path);
    }
}
