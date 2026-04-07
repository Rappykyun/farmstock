<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStatusRequest;
use App\Http\Requests\Admin\UpdateStatusRequest;
use App\Models\Status;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StatusController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/statuses/index', [
            'statuses' => Status::query()
                ->orderBy('type')
                ->orderBy('name')
                ->get()
                ->map(fn(Status $status) => [
                    'id' => $status->id,
                    'name' => $status->name,
                    'slug' => $status->slug,
                    'type' => $status->type,
                    'color' => $status->color,
                    'description' => $status->description,
                    'is_active' => $status->is_active,
                    'created_at' => $status->created_at?->toDateTimeString(),
                ]),
        ]);
    }

    public function store(StoreStatusRequest $request): RedirectResponse
    {
        $data = $request->validated();

        Status::create([
            ...$data,
            'slug' => Str::slug($data['name']),
        ]);

        return to_route('admin.statuses.index');
    }

    public function update(UpdateStatusRequest $request, Status $status): RedirectResponse
    {
        $data = $request->validated();

        $status->update([
            ...$data,
            'slug' => Str::slug($data['name']),
        ]);

        return to_route('admin.statuses.index');
    }

    public function destroy(Status $status): RedirectResponse
    {
        $status->delete();

        return to_route('admin.statuses.index');
    }
}
