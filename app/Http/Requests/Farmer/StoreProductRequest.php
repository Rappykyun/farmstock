<?php

namespace App\Http\Requests\Farmer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
        ]);
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'status_id' => [
                'required',
                'integer',
                Rule::exists('statuses', 'id')->where(fn($query) => $query->where('type', 'product')),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
