<?php

use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::resource("products", ProductController::class);
Route::resource("coupons", CouponController::class);
Route::resource("orders", OrderController::class);