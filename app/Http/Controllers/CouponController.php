<?php

namespace App\Http\Controllers;

use App\Http\Requests\CouponRequest;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coupons = Coupon::orderBy('id', 'desc')->paginate(10);

        return response()->json($coupons);
    }

    public function show($id) {
        $coupon = Coupon::find($id);
        if(!$coupon) return response()->json(["message" => "Cupom não encontrado."], 404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CouponRequest $request)
    {
        $coupon = Coupon::create($request->validated());

        return response()->json($coupon);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CouponRequest $request, string $id)
    {
        $coupon = Coupon::find($id);
        if(!$coupon) return abort(404);

        $coupon->update($request->validated());

        return response()->json($coupon);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $coupon = Coupon::find($id);
        if(!$coupon) return redirect("coupons");

        $orders_amount = $coupon->orders()->count();
        if($orders_amount > 0) {
            return redirect()->back()->withErrors(['message' => 'Ainda há pedidos com este cupom.']);
        }

        $coupon->delete();

        return response()->json(["message" => "cupom criado"]);
    }
}
