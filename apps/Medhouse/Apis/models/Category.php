<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    // Relationships
    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function activeMenuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)->where('is_available', true);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order')->orderBy('name');
    }

    // Accessors
    public function getImageUrlAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // If URL is already complete, return as-is
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // If URL starts with /, assume it's relative to domain
        if (str_starts_with($value, '/')) {
            return config('app.url') . $value;
        }

        // Otherwise, assume it's in storage
        return config('app.url') . '/storage/' . $value;
    }
}
