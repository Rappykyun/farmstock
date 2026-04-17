<?php

namespace App\Policies;

use App\Models\OrderRequest;
use App\Models\User;

class OrderRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['consumer', 'farmer']);
    }

    public function view(User $user, OrderRequest $orderRequest): bool
    {
        if ($user->hasRole('consumer')) {
            return $orderRequest->consumer_id === $user->id;
        }

        if ($user->hasRole('farmer')) {
            return $orderRequest->farmer_id === $user->id;
        }

        return false;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('consumer');
    }

    public function update(User $user, OrderRequest $orderRequest): bool
    {
        return $user->hasRole('farmer')
            && $orderRequest->farmer_id === $user->id;
    }
}
