<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use App\Models\MenuItem;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, create categories from existing menu items
        $this->createCategoriesFromMenuItems();

        // Add category_id column to menu_items table
        Schema::table('menu_items', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('category');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->index('category_id');
        });

        // Update menu items with category_id based on category name
        $this->updateMenuItemsWithCategoryId();

        // Make category_id required and drop old category column
        Schema::table('menu_items', function (Blueprint $table) {
            // Drop foreign key temporarily
            $table->dropForeign(['category_id']);
        });

        // Change column to not nullable
        Schema::table('menu_items', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable(false)->change();
        });

        // Re-add foreign key and drop old category column
        Schema::table('menu_items', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->dropColumn('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add back the category column
        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('category', 100)->after('price');
        });

        // Restore category names from category_id
        $menuItems = DB::table('menu_items')
            ->join('categories', 'menu_items.category_id', '=', 'categories.id')
            ->select('menu_items.id', 'categories.name as category_name')
            ->get();

        foreach ($menuItems as $item) {
            DB::table('menu_items')
                ->where('id', $item->id)
                ->update(['category' => $item->category_name]);
        }

        // Drop foreign key and category_id column
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }

    /**
     * Create categories from existing menu items
     */
    private function createCategoriesFromMenuItems(): void
    {
        $categories = DB::table('menu_items')
            ->select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category');

        $displayOrder = 1;
        foreach ($categories as $categoryName) {
            DB::table('categories')->insert([
                'name' => $categoryName,
                'description' => "Category for {$categoryName} items",
                'display_order' => $displayOrder,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $displayOrder++;
        }
    }

    /**
     * Update menu items with category_id based on category name
     */
    private function updateMenuItemsWithCategoryId(): void
    {
        $categories = DB::table('categories')->get();

        foreach ($categories as $category) {
            DB::table('menu_items')
                ->where('category', $category->name)
                ->update(['category_id' => $category->id]);
        }
    }
};
