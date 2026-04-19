<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $role = $request->string('role')->toString();
        $isActive = $request->query('is_active');

        return Inertia::render('admin/users/index', [
            'filters' => [
                'role' => $role,
                'is_active' => $isActive,
            ],
            'availableRoles' => ['admin', 'farmer', 'consumer'],
            'users' => User::query()
                ->with('roles')
                ->when($role !== '', fn($query) => $query->role($role))
                ->when($isActive !== null && $isActive !== '', fn($query) => $query->where('is_active', filter_var($isActive, FILTER_VALIDATE_BOOL)))
                ->orderBy('name')
                ->get()
                ->map(fn(User $user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'address' => $user->address,
                    'contact_number' => $user->contact_number,
                    'farm_name' => $user->farm_name,
                    'is_active' => $user->is_active,
                    'role' => $user->getRoleNames()->first(),
                    'created_at' => $user->created_at?->toDateTimeString(),
                ]),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $user->update([
            'is_active' => $data['is_active'],
        ]);

        $user->syncRoles([$data['role']]);

        return to_route('admin.users.index');
    }
}
