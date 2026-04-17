<?php

namespace App\Policies;

use App\Models\OrderRequest;
use App\Models\User;

class OrderRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('consumer');
    }

    public function view(User $user, OrderRequest $orderRequest): bool
    {
        return $user->hasRole('consumer')
            && $orderRequest->consumer_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('consumer');
    }
}
