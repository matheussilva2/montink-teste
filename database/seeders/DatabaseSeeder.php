<?php

namespace Database\Seeders;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $base_product = Product::factory()->count(50)->create();
        if($base_product)
            Product::factory()->count(5)->create([
                'id_product_variation' => Product::inRandomOrder()->first()->id
            ]);

        Coupon::factory()->count(10)->create();

        Order::factory()->count(25)->hasProducts(3)->create();
    }
}
