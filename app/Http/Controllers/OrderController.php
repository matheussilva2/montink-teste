<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatusEnum;
use App\Http\Requests\OrderRequest;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderProduct;
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
        $data = $this->buildOrderPaymentData($request->validated());
        
        $order_data = [
            "subtotal" => $data["payment"]["subtotal"],
            "shipping" => floatval($data["payment"]["shipping"]),
            "discount" => floatval($data["payment"]["discount"]),
            "total" => floatval($data["payment"]["total"]),
            "email" => $data["payment"]["email"],
            "status" => OrderStatusEnum::Pending,
            "address" => $data["shipping"]["address"],
            "city" => $data["shipping"]["city"],
            "state" => $data["shipping"]["state"],
            "postal_code" => $data["shipping"]["postal_code"],
            "coupon_id" => $data["payment"]["coupon"] ? $data["payment"]["coupon"]->id : null,
        ];
        
        $order = Order::create($order_data);

        $order_products = [];

        foreach($data["cart"] as $item) {
            array_push($order_products, [
                "product_id" => $item["product"]->id,
                "price" => $item["product"]->price,
                "quantity" => $item["quantity"]
            ]);
        }

        $order->products()->createMany($order_products);

        return response()->json(["message" => "Pedido criado!"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::find($id);
        if(!$order) return redirect("orders");

        $order->product = $order->products();
        if($order->product->id_product_variation) {
            $order->product->product = $order->product->products();
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

    private function buildOrderPaymentData($data) {
        $orderData = [
            "cart" => [],
            "payment" => [
                "email" => $data["payment"]["email"],
                "subtotal" => 0,
                "coupon" => null,
                "discount" => 0,
                "shipping" => 0,
                "subtotal" => 0,
                "total" => 0
            ],
            "shipping" => [
                "postal_code" => $data["payment"]["shipping_data"]["postal_code"],
                "address" => $data["payment"]["shipping_data"]["address"],
                "city" => $data["payment"]["shipping_data"]["city"],
                "state" => $data["payment"]["shipping_data"]["state"],
            ]
        ];

        foreach($data["cart"] as $cartItem) {
            $product = Product::find($cartItem["id"]);
            array_push($orderData["cart"], [
                "product" => $product,
                "quantity" => $cartItem["quantity"]
            ]);
            $orderData["payment"]["subtotal"] += $product->price;
        }

        if(isset($data["payment"]["coupon"])) {
            $orderData["payment"]["coupon"] = Coupon::find($data["payment"]["coupon"]["id"]);
            $orderData["payment"]["discount"] = $orderData["payment"]["subtotal"] * ($orderData["payment"]["coupon"]->discount / 100);
        }

        if($orderData["payment"]["subtotal"] >= 52 && $orderData["payment"]["subtotal"] < 166.59) {
            $orderData["payment"]["shipping"] = 15;
        } else if ($orderData["payment"]["subtotal"] > 200) {
            $orderData["payment"]["shipping"] = 0;
        } else {
            $orderData["payment"]["shipping"] = 20;
        }

        $orderData["payment"]["total"] = $orderData["payment"]["subtotal"] - $orderData["payment"]["discount"] + $orderData["payment"]["shipping"];

        //Passar para duas casas decimais
        $orderData["payment"]["total"] = number_format($orderData["payment"]["total"], 2);
        $orderData["payment"]["subtotal"] = number_format($orderData["payment"]["subtotal"], 2);
        $orderData["payment"]["shipping"] = number_format($orderData["payment"]["shipping"], 2);
        $orderData["payment"]["discount"] = number_format($orderData["payment"]["discount"], 2);
        $orderData["payment"]["total"] = floatval(str_replace(",", "", $orderData["payment"]["total"]));
        $orderData["payment"]["subtotal"] = floatval(str_replace(",", "", $orderData["payment"]["subtotal"]));
        $orderData["payment"]["shipping"] = floatval(str_replace(",", "", $orderData["payment"]["shipping"]));
        $orderData["payment"]["discount"] = floatval(str_replace(",", "", $orderData["payment"]["discount"]));

        return $orderData;
    }
}
