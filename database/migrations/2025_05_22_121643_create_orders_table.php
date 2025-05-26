<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->decimal("subtotal", 8, 2);
            $table->decimal("shipping", 8, 2);
            $table->decimal("discount", 8, 2);
            $table->decimal("total", 8, 2);
            $table->string("email");
            $table->enum("status", ["pending", "paid", "cancelled", "refunded"]);
            $table->string("address");
            $table->string("city");
            $table->string("state");
            $table->string("postal_code");
            $table->timestamp("paid_at")->nullable();
            $table->foreignId("coupon_id")->nullable()->constrained("coupons");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
