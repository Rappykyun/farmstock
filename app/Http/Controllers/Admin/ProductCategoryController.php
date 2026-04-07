<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductCategoryRequest;
use App\Http\Requests\Admin\UpdateProductCategoryRequest;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/product-categories/index', [
            'categories' => ProductCategory::query()
                ->orderBy('name')
                ->get()
                ->map(fn(ProductCategory $category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'is_active' => $category->is_active,
                    'created_at' => $category->created_at?->toDateTimeString(),
                ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductCategoryRequest $request): RedirectResponse
    {
        $data = $request->validated();

        ProductCategory::create([
            ...$data,
            'slug' => Str::slug($data['name']),
        ]);

        return to_route('admin.product-categories.index');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request, ProductCategory $productCategory): RedirectResponse
    {
        $data = $request->validated();

        $productCategory->update([
            ...$data,
            'slug' => Str::slug($data['name']),
        ]);

        return to_route('admin.product-categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory): RedirectResponse
    {
        $productCategory->delete();

        return to_route('admin.product-categories.index');
    }
}
