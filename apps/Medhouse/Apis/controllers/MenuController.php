<?php
namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\AddOn;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    /**
     * Get all menu items
     */
    public function getMenuItems(Request $request): JsonResponse
    {
        try {
            $query = MenuItem::with(['addOns', 'category']);

            // Filter by category if provided
            if ($request->has('category')) {
                // Support both category ID and category name
                if (is_numeric($request->category)) {
                    $query->byCategory($request->category);
                } else {
                    $query->byCategoryName($request->category);
                }
            }

            // Filter by availability if provided
            if ($request->has('available')) {
                if ($request->boolean('available')) {
                    $query->available();
                }
            }

            // Filter by vegetarian if provided
            if ($request->boolean('vegetarian')) {
                $query->vegetarian();
            }

            // Filter by spicy if provided
            if ($request->boolean('spicy')) {
                $query->spicy();
            }

            $menuItems = $query->orderBy('name')->get();

            return response()->json([
                'success' => true,
                'data'    => $menuItems,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch menu items',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get menu categories
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
                'data'    => $categories,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single menu item
     */
    public function getItem($id): JsonResponse
    {
        try {
            $menuItem = MenuItem::with('addOns')->find($id);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data'    => $menuItem,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch menu item',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get add-ons for a menu item
     */
    public function getItemAddOns($id): JsonResponse
    {
        try {
            $menuItem = MenuItem::find($id);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            $addOns = $menuItem->addOns()->available()->get();

            return response()->json([
                'success' => true,
                'data'    => $addOns,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch add-ons',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new menu item (Admin only)
     */
    public function createMenuItem(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'             => 'required|string|max:255',
                'description'      => 'nullable|string',
                'price'            => 'required|numeric|min:0',
                'category_id'      => 'required|integer|exists:categories,id',
                'image_url'        => 'nullable|url|max:500',
                'is_available'     => 'sometimes|boolean',
                'preparation_time' => 'nullable|integer|min:0',
                'is_spicy'         => 'sometimes|boolean',
                'is_vegetarian'    => 'sometimes|boolean',
                'ingredients'      => 'nullable|string',
                'allergens'        => 'nullable|string',
                'calories'         => 'nullable|integer|min:0',
                'add_on_ids'       => 'nullable|array',
                'add_on_ids.*'     => 'exists:add_ons,id',
                'add_ons'          => 'nullable|array',
                'add_ons.*.name'   => 'required_with:add_ons|string|max:255',
                'add_ons.*.price'  => 'required_with:add_ons|numeric|min:0',
                'add_ons.*.type'   => 'nullable|string|max:50',
                'add_ons.*.description' => 'nullable|string',
                'add_ons.*.is_available' => 'nullable|boolean',
                'add_ons.*.is_default_included' => 'nullable|boolean', // This is for the pivot table
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            DB::beginTransaction();

            $menuItem = MenuItem::create($request->except(['add_on_ids', 'add_ons']));

            // Handle add-ons
            $addOnAttachData = [];

            // Process add_ons array (create new add-ons or find existing ones)
            if ($request->has('add_ons') && is_array($request->add_ons)) {
                foreach ($request->add_ons as $addOnData) {
                    $addOnId = null;

                    if (isset($addOnData['id']) && $addOnData['id'] > 0) {
                        // Existing add-on
                        $addOnId = $addOnData['id'];
                    } else {
                        // Create new add-on
                        $addOn = AddOn::create([
                            'name' => $addOnData['name'],
                            'price' => $addOnData['price'],
                            'type' => $addOnData['type'] ?? 'extra',
                            'description' => $addOnData['description'] ?? null,
                            'is_available' => $addOnData['is_available'] ?? true,
                        ]);
                        $addOnId = $addOn->id;
                    }

                    // Store pivot data for this add-on
                    $addOnAttachData[$addOnId] = [
                        'price' => $addOnData['price'] ?? null,
                        'is_default_included' => $addOnData['is_default_included'] ?? false,
                    ];
                }
            }

            // Also handle add_on_ids if provided (for backward compatibility)
            if ($request->has('add_on_ids') && is_array($request->add_on_ids)) {
                foreach ($request->add_on_ids as $addOnId) {
                    if (!isset($addOnAttachData[$addOnId])) {
                        // Get default values from the add-on itself
                        $addOn = AddOn::find($addOnId);
                        $addOnAttachData[$addOnId] = [
                            'price' => $addOn ? $addOn->price : null,
                            'is_default_included' => false,
                        ];
                    }
                }
            }

            // Attach all add-ons to the menu item with pivot data
            if (!empty($addOnAttachData)) {
                $menuItem->addOns()->attach($addOnAttachData);
            }

            DB::commit();

            $menuItem->load('addOns');

            return response()->json([
                'success' => true,
                'message' => 'Menu item created successfully',
                'data'    => $menuItem,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create menu item',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update menu item (Admin only)
     */
    public function updateMenuItem(Request $request, $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::find($id);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name'             => 'sometimes|required|string|max:255',
                'description'      => 'nullable|string',
                'price'            => 'sometimes|required|numeric|min:0',
                'category_id'      => 'sometimes|required|integer|exists:categories,id',
                'image_url'        => 'nullable|string|max:500',
                'is_available'     => 'sometimes|boolean',
                'preparation_time' => 'nullable|integer|min:1',
                'is_spicy'         => 'sometimes|boolean',
                'is_vegetarian'    => 'sometimes|boolean',
                'ingredients'      => 'nullable|string',
                'allergens'        => 'nullable|string',
                'calories'         => 'nullable|integer|min:0',
                'add_on_ids'       => 'nullable|array',
                'add_on_ids.*'     => 'exists:add_ons,id',
                'add_ons'          => 'nullable|array',
                'add_ons.*.name'   => 'required_with:add_ons|string|max:255',
                'add_ons.*.price'  => 'required_with:add_ons|numeric|min:0',
                'add_ons.*.type'   => 'nullable|string|max:50',
                'add_ons.*.description' => 'nullable|string',
                'add_ons.*.is_available' => 'nullable|boolean',
                'add_ons.*.is_default_included' => 'nullable|boolean', // This is for the pivot table
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            DB::beginTransaction();

            $menuItem->update($request->except(['add_on_ids', 'add_ons']));

            // Handle add-ons
            $addOnSyncData = [];

            // Process add_ons array (create new add-ons or find existing ones)
            if ($request->has('add_ons') && is_array($request->add_ons)) {
                foreach ($request->add_ons as $addOnData) {
                    $addOnId = null;

                    if (isset($addOnData['id']) && $addOnData['id'] > 0) {
                        // Existing add-on, update it if needed
                        $addOn = AddOn::find($addOnData['id']);
                        if ($addOn) {
                            $addOn->update([
                                'name' => $addOnData['name'],
                                'price' => $addOnData['price'],
                                'type' => $addOnData['type'] ?? 'extra',
                                'description' => $addOnData['description'] ?? null,
                                'is_available' => $addOnData['is_available'] ?? true,
                            ]);
                            $addOnId = $addOn->id;
                        }
                    } else {
                        // Create new add-on
                        $addOn = AddOn::create([
                            'name' => $addOnData['name'],
                            'price' => $addOnData['price'],
                            'type' => $addOnData['type'] ?? 'extra',
                            'description' => $addOnData['description'] ?? null,
                            'is_available' => $addOnData['is_available'] ?? true,
                        ]);
                        $addOnId = $addOn->id;
                    }

                    // Store pivot data for this add-on
                    if ($addOnId) {
                        $addOnSyncData[$addOnId] = [
                            'price' => $addOnData['price'] ?? null,
                            'is_default_included' => $addOnData['is_default_included'] ?? false,
                        ];
                    }
                }
            }

            // Also handle add_on_ids if provided (for backward compatibility)
            if ($request->has('add_on_ids') && is_array($request->add_on_ids)) {
                foreach ($request->add_on_ids as $addOnId) {
                    if (!isset($addOnSyncData[$addOnId])) {
                        // Get default values from the add-on itself
                        $addOn = AddOn::find($addOnId);
                        $addOnSyncData[$addOnId] = [
                            'price' => $addOn ? $addOn->price : null,
                            'is_default_included' => false,
                        ];
                    }
                }
            }

            // Sync all add-ons to the menu item with pivot data
            if ($request->has('add_ons') || $request->has('add_on_ids')) {
                $menuItem->addOns()->sync($addOnSyncData);
            }

            DB::commit();

            $menuItem->load('addOns');

            return response()->json([
                'success' => true,
                'message' => 'Menu item updated successfully',
                'data'    => $menuItem,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu item',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete menu item (Admin only)
     */
    public function delete($id): JsonResponse
    {
        try {
            $menuItem = MenuItem::find($id);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            $menuItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Menu item deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete menu item',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update menu item availability status (Admin only)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::find($id);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'is_available' => 'required|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $menuItem->is_available = $request->is_available;
            $menuItem->save();

            return response()->json([
                'success' => true,
                'message' => 'Menu item status updated successfully',
                'data'    => $menuItem,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu item status',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add add-on to menu item (Admin only)
     */
    public function addAddOn(Request $request, $id): JsonResponse
    {
        try {
            $menuItem = MenuItem::find($id);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'add_on_id' => 'required|exists:add_ons,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $menuItem->addOns()->syncWithoutDetaching([$request->add_on_id]);

            return response()->json([
                'success' => true,
                'message' => 'Add-on added to menu item successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add add-on to menu item',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove add-on from menu item (Admin only)
     */
    public function removeAddOn($menuId, $addonId): JsonResponse
    {
        try {
            $menuItem = MenuItem::find($menuId);

            if (! $menuItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Menu item not found',
                ], 404);
            }

            $menuItem->addOns()->detach($addonId);

            return response()->json([
                'success' => true,
                'message' => 'Add-on removed from menu item successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove add-on from menu item',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
