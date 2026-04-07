<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'slug',
    'type',
    'color',
    'description',
    'is_active',
])]
class Status extends Model
{
    use HasFactory;

    public function products(): HasMany
    {
        return $this->hasMany(\App\Models\Product::class, 'status_id');
    }

    public function inventoryLogs(): HasMany
    {
        return $this->hasMany(\App\Models\InventoryLog::class, 'status_id');
    }

    public function orderRequests(): HasMany
    {
        return $this->hasMany(\App\Models\OrderRequest::class, 'status_id');
    }
}
