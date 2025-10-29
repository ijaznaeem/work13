<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
        'image_url',
        'is_available',
        'preparation_time',
        'is_spicy',
        'is_vegetarian',
        'ingredients',
        'allergens',
        'calories',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'is_spicy' => 'boolean',
        'is_vegetarian' => 'boolean',
        'preparation_time' => 'integer',
        'calories' => 'integer',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function addOns(): BelongsToMany
    {
        return $this->belongsToMany(AddOn::class, 'menu_item_add_ons')
                    ->withPivot('price', 'is_default_included')
                    ->withTimestamps();
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByCategoryName($query, $categoryName)
    {
        return $query->whereHas('category', function ($q) use ($categoryName) {
            $q->where('name', $categoryName);
        });
    }

    public function scopeVegetarian($query)
    {
        return $query->where('is_vegetarian', true);
    }

    public function scopeSpicy($query)
    {
        return $query->where('is_spicy', true);
    }
}
