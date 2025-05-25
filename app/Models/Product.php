<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'id_product_variation'];

    public function stock()
    {
        return $this->hasOne(Stock::class)->first();
    }

    public function variations() {
        return $this->hasMany(Product::class, 'id_product_variation')->get();
    }

    public function product() {
        return $this->belongsTo(Product::class, 'id_product_variation')->first();
    }
}
