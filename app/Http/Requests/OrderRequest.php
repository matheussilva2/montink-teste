<?php

namespace App\Http\Requests;

use App\Enums\OrderStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|integer',
            'cart.*.name' => 'required|string',
            'cart.*.price' => 'required|numeric|min:0',
            'cart.*.quantity' => 'required|integer|min:1',

            'payment' => 'required|array',
            'payment.total' => 'required|numeric|min:0',
            'payment.shipping' => 'required|numeric|min:0',
            'payment.discount' => 'required|numeric|min:0',
            'payment.subtotal' => 'required|numeric|min:0',
            'payment.email' => 'required|email',

            'payment.coupon' => 'nullable|array',
            'payment.coupon.id' => 'nullable|integer',
            'payment.coupon.code' => 'nullable|string',
            'payment.coupon.discount' => 'nullable|numeric',
            'payment.coupon.expires_at' => 'nullable|date',

            'payment.shipping_data' => 'required|array',
            'payment.shipping_data.postal_code' => 'required|string',
            'payment.shipping_data.address' => 'required|string',
            'payment.shipping_data.city' => 'required|string',
            'payment.shipping_data.state' => 'required|string'
        ];
    }
}
