<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = ['amount', 'product_id'];

    public function product() {
        return $this->belongsTo(Product::class);
    }
}
