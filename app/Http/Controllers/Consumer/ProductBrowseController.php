<?php

namespace App\Http\Controllers\Consumer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductBrowseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $category = $request->string('category')->toString();
        $sort = $request->string('sort')->toString();

        $products = Product::query()
            ->with([
                'category:id,name,slug',
                'unit:id,name,abbreviation',
                'farmer:id,name,farm_name,address',
                'images',
            ])
            ->where('is_active', true)
            ->where('current_stock', '>', 0)
            ->when($search !== '', fn($query) => $query->where(function ($subQuery) use ($search) {
                $subQuery
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            }))
            ->when($category !== '', fn($query) => $query->whereHas(
                'category',
                fn($categoryQuery) => $categoryQuery->where('slug', $category)
            ))
            ->when($sort === 'price_asc', fn($query) => $query->orderBy('price'))
            ->when($sort === 'price_desc', fn($query) => $query->orderByDesc('price'))
            ->when($sort === 'name_asc', fn($query) => $query->orderBy('name'))
            ->when($sort === '' || $sort === 'latest', fn($query) => $query->latest())
            ->paginate(12)
            ->withQueryString()
            ->through(fn(Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'current_stock' => $product->current_stock,
                'category' => $product->category?->name,
                'unit' => $product->unit?->abbreviation,
                'farmer_name' => $product->farmer?->farm_name ?: $product->farmer?->name,
                'image' => $product->images->first()
                    ? Storage::disk('products')->url($product->images->first()->path)
                    : null,
            ]);

        return Inertia::render('products/index', [
            'filters' => [
                'search' => $search,
                'category' => $category,
                'sort' => $sort === '' ? 'latest' : $sort,
            ],
            'categories' => ProductCategory::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->is_active && (float) $product->current_stock > 0, 404);

        $product->load([
            'category:id,name,slug',
            'unit:id,name,abbreviation',
            'status:id,name,color',
            'farmer:id,name,farm_name,address,contact_number',
            'images',
        ]);

        return Inertia::render('products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'current_stock' => $product->current_stock,
                'category' => $product->category?->name,
                'unit' => $product->unit?->abbreviation,
                'status' => $product->status?->name,
                'status_color' => $product->status?->color,
                'farmer' => [
                    'name' => $product->farmer?->name,
                    'farm_name' => $product->farmer?->farm_name,
                    'address' => $product->farmer?->address,
                    'contact_number' => $product->farmer?->contact_number,
                ],
                'images' => $product->images->map(fn($image) => [
                    'id' => $image->id,
                    'is_primary' => $image->is_primary,
                    'url' => Storage::disk('products')->url($image->path),
                    'thumbnail_url' => $this->productImageThumbnailUrl($image->path),
                ])->values(),
            ],
        ]);
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
