<?php

namespace App\Http\Requests\Farmer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequestStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:accepted,rejected,completed'],
            'rejection_reason' => ['nullable', 'string', 'max:1000', 'required_if:status,rejected'],
        ];
    }
}
