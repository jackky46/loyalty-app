<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::orderBy('name')->get()->map(function ($product) {
            $product->image_url = $product->image_path ? Storage::url($product->image_path) : null;
            return $product;
        });

        return Inertia::render('Admin/Products', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'category' => 'required|string|max:50',
            'description' => 'nullable|string',
            'is_available' => 'required',
            'max_voucher_price' => 'integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'category' => $request->category,
            'description' => $request->description,
            'is_available' => $request->is_available == '1',
            'max_voucher_price' => $request->max_voucher_price ?? 22000,
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Product created successfully');
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'category' => 'required|string|max:50',
            'description' => 'nullable|string',
            'is_available' => 'required',
            'max_voucher_price' => 'integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = $product->image_path;
        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'category' => $request->category,
            'description' => $request->description,
            'is_available' => $request->is_available == '1',
            'max_voucher_price' => $request->max_voucher_price ?? 22000,
            'image_path' => $imagePath,
        ]);

        return back()->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        // Delete image if exists
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        
        $product->delete();

        return back()->with('success', 'Product deleted successfully');
    }
}

