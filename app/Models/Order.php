<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['subtotal', 'shipping', 'discount', 'total', 'status', 'address', 'postal_code', 'paid_at', 'coupon_id', 'product_id', 'email', 'city', 'state'];

    public function products() {
        return $this->hasMany(OrderProduct::class, 'order_id');
    }

    public function coupon() {
        return $this->belongsTo(Coupon::class)->first();
    }
}
