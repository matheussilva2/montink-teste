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
            'email' => ['required', 'email'],
            'status' => ['required', new Enum(OrderStatusEnum::class)],
            'coupon_id' => ['required'],
            'product_id' => ['required'],
            'postal_code' => ['required'],
            'address' => ['required'],
            'state' => ['required'],
            'city' => ['required']        
        ];
    }
}
