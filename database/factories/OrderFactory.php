<?php

namespace Database\Factories;

use App\Enums\OrderStatusEnum;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'value' => $this->faker->randomFloat(2, 10, 500),
            'status' => $this->faker->randomElement(OrderStatusEnum::cases())->value,
            'address' => "{$this->faker->streetName()}, {$this->faker->city()} - {$this->faker->state()}",
            'postal_code' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'state' => $this->faker->state(),
            'paid_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'coupon_id' => $this->faker->optional(0.5)->randomElement(Coupon::pluck('id')->toArray() ?: [null]),
            'product_id' => Product::factory(),
            'email' => $this->faker->email()
        ];
    }
}
