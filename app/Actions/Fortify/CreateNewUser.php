<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'address' => ['required', 'string', 'max:255'],
            'contact_number' => ['required', 'string', 'max:50'],
            'role' => ['required', 'in:farmer,consumer'],
            'farm_name' => ['nullable', 'required_if:role,farmer', 'string', 'max:255'],
            'farm_details' => ['nullable', 'required_if:role,farmer', 'string'],
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'address' => $input['address'],
            'contact_number' => $input['contact_number'],
            'farm_name' => $input['role'] === 'farmer' ? $input['farm_name'] : null,
            'farm_details' => $input['role'] === 'farmer' ? $input['farm_details'] : null,
        ]);

        $user->assignRole($input['role']);

        return $user;
    }
}
