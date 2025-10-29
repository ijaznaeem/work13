<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function getCategories(): JsonResponse
    {
        try {
            $categories = Category::active()
                ->ordered()
                ->withCount('activeMenuItems')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single category
     */
    public function getCategory($id): JsonResponse
    {
        try {
            $category = Category::with(['menuItems' => function ($query) {
                $query->where('is_available', true)->orderBy('name');
            }])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $category,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Create new category (Admin only)
     */
    public function createCategory(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name',
                'description' => 'nullable|string',
                'image_url' => 'nullable|string|max:500',
                'display_order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            // If no display_order provided, set it to the next available order
            if (!isset($data['display_order'])) {
                $maxOrder = Category::max('display_order') ?? 0;
                $data['display_order'] = $maxOrder + 1;
            }

            $category = Category::create($data);

            return response()->json([
                'success' => true,
                'data' => $category,
                'message' => 'Category created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update category (Admin only)
     */
    public function updateCategory(Request $request, $id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $id,
                'description' => 'nullable|string',
                'image_url' => 'nullable|string|max:500',
                'display_order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $category->update($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $category->fresh(),
                'message' => 'Category updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete category (Admin only)
     */
    public function deleteCategory($id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);

            // Check if category has menu items
            if ($category->menuItems()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category that has menu items. Please move or delete the menu items first.',
                ], 400);
            }

            // Delete image if exists
            if ($category->image_url && Storage::exists('public/' . $category->image_url)) {
                Storage::delete('public/' . $category->image_url);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update category display order (Admin only)
     */
    public function updateDisplayOrder(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'categories' => 'required|array',
                'categories.*.id' => 'required|integer|exists:categories,id',
                'categories.*.display_order' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            foreach ($request->categories as $categoryData) {
                Category::where('id', $categoryData['id'])
                    ->update(['display_order' => $categoryData['display_order']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Category display order updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category display order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle category status (Admin only)
     */
    public function toggleStatus($id): JsonResponse
    {
        try {
            $category = Category::findOrFail($id);
            $category->update(['is_active' => !$category->is_active]);

            return response()->json([
                'success' => true,
                'data' => $category->fresh(),
                'message' => 'Category status updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
