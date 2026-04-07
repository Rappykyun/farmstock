<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'farmer']);
    }

    public function view(User $user, Product $product): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasRole('farmer') && $product->farmer_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'farmer']);
    }

    public function update(User $user, Product $product): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasRole('farmer') && $product->farmer_id === $user->id;
    }

    public function delete(User $user, Product $product): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return $user->hasRole('farmer') && $product->farmer_id === $user->id;
    }

    public function restore(User $user, Product $product): bool
    {
        return $this->delete($user, $product);
    }

    public function forceDelete(User $user, Product $product): bool
    {
        return $user->hasRole('admin');
    }
}
