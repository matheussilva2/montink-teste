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
        $products = Product::whereNull('id_product_variation')->orderBy('id', 'desc')->paginate(10);

        foreach($products as $product) {
            $product->variations = $product->variations();
        }
        
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
        ]);

        Stock::create([
            "amount" => $request->stock,
            "product_id" => $product->id
        ]);
        
        if(array_key_exists("variations", $request->validated())){
            foreach($request->validated()["variations"] as $variation) {
                $product_variation = Product::create([
                    "name" => $variation["name"],
                    "price" => $variation["price"],
                    "id_product_variation" => $product->id
                ]);

                Stock::create([
                    "amount" => $variation["stock"],
                    "product_id" => $product_variation->id
                ]);
            }
        }

        return response()->json($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        if(!$product) return response()->json(["message" => "Produto não encontrado!"], 404);

        $product->variations = $product->variations();
        $stock = $product->stock();
        $product->stock = $stock->amount;

        foreach($product->variations as $variation) {
            $variation->stock = $variation->stock()->amount;
        }

        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProductRequest $request, string $id)
    {
        $product = Product::find($id);
        
        $product->update([
            "name" => $request->name,
            "price" => $request->price
        ]);

        $product->stock()->update(['amount' => $request->stock]);

        foreach($request->validated()['variations'] as $item) {
            $variation = Product::find($item['id']);
            if(!$variation) continue;

            $variation->update([
                "name" => $item["name"],
                "price" => $item["price"],
            ]);

            $variation->stock()->update([
                "amount" => $item["stock"]
            ]);
        }

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
