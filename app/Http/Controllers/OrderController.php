<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::orderBy("id", "desc")->paginate(30);
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderRequest $request)
    {
        $product = Product::find($request->product_id);
        
        $order_data = [
            "email" => $request->email,
            "status" => $request->status,
            "address" => "{$request->address}",
            "city" => $request->city,
            "state" => $request->state,
            "postal_code" => $request->postal_code,
            "coupon_id" => $request->coupon_id,
            "product_id" => $request->product_id,
            "value" => $product->price
        ];
        
        Order::create($order_data);

        return response()->json(["message" => "Pedido criado!"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::find($id);
        if(!$order) return redirect("orders");

        $order->product = $order->product();
        if($order->product->id_product_variation) {
            $order->product->product = $order->product->product();
        }

        if($order->coupon_id) {
            $order->coupon = $order->coupon();
            $order->total_discount = $order->value - $order->value * ($order->coupon->discount/100);
            $order->total_discount = number_format($order->total_discount, 2, ',', '.');
        } else {
            $order->total_discount = 0;
        }

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrderRequest $request, string $id)
    {
        $order = Order::find($id);
        if(!$order) return response()->json(["message" => "Pedido não encontrado"], 404);

        $product = Product::find($request->product_id);
        
        $order_data = [
            "email" => $request->email,
            "status" => $request->status,
            "address" => "{$request->address}",
            "city" => $request->city,
            "state" => $request->state,
            "postal_code" => $request->postal_code,
            "coupon_id" => $request->coupon_id,
            "product_id" => $request->product_id,
            "value" => $product->price
        ];

        $order->update($order_data);

        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::find($id);
        if(!$order) return redirect("/orders");

        $order->delete();

        return response()->json(["message" => "Pedido excluído"]);
    }
}
