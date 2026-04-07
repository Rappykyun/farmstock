<?php

namespace App\Http\Requests\Admin;

use App\Models\Status;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
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
        /** @var \App\Models\Status $status */
        $status = $this->route('status');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique(Status::class, 'name')
                    ->where(fn($query) => $query->where('type', $this->input('type')))
                    ->ignore($status),
            ],
            'type' => ['required', 'in:product,inventory,order'],
            'color' => ['required', 'string', 'max:20'],
            'description' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
