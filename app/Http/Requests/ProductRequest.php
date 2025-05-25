<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProductRequest extends FormRequest
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
            'name' => ['required'],
            'price' => ['required'],
            'variation' => ['nullable'],
            'stock' => ['required'],
            'variations.*.name' => ["required", "string"],
            "variations.*.price" => ["required", "numeric"],
            "variations.*.stock" => ["required", "numeric"]
        ];
    }

    public function failedVerification(Validator $validator) {
        throw new HttpResponseException(response()->json([
            'status' => 'false',
            'message' => 'Falha na validação',
            'erros' => $validator->errors()
        ], 422));
    }
}
