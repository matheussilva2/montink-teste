<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{
    use HasFactory;
    
    protected $fillable = ["price", "product_id", "quantity", "order_id"];

    public function order() {
        return $this->belongsTo(Order::class)->first();
    }

    public function product() {
        return $this->belongsTo(Product::class)->first();
    }
}
