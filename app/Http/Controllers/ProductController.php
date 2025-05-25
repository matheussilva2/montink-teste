<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::orderBy('id', 'desc')->paginate(10);
        
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductRequest $request)
    {
        $product = Product::create([
            "name" => $request->name,
            "price" => $request->price,
            "id_product_variation" => $request->variation === "none" ? null : $request->variation
        ]);

        Stock::create([
            "amount" => $request->stock,
            "product_id" => $product->id
        ]);

        return redirect("products");
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        if(!$product) return response()->json(["message" => "Produto não encontrado!"], 404);

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        
        $product->update([
            "name" => $request->name,
            "price" => $request->price,
            "variation" => $request->variation ?: ""
        ]);

        $product->stock()->update(['amount' => $request->stock]);

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);
        if(!$product) return response()->json(["message" => "Produto não encontrado!"]);

        $product->stock()->delete();
        $product->delete();
        return response()->json($product);
    }
}
