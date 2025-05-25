<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['value', 'status', 'address', 'postal_code', 'paid_at', 'coupon_id', 'product_id', 'email', 'city', 'state'];

    public function product() {
        return $this->belongsTo(Product::class)->first();
    }

    public function coupon() {
        return $this->belongsTo(Coupon::class)->first();
    }
}
