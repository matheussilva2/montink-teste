<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'price' => rand(11.5, 1000),
            'id_product_variation' => $this->faker->optional(0.5, null)->randomElement(Product::pluck('id')->toArray())
        ];
    }

    public function configure() {
        return $this->afterCreating(function (Product $product) {
            Stock::factory()->create(['product_id' => $product->id]);
        });
    }
}
