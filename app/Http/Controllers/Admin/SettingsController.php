<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $defaults = collect([
            [
                'key' => 'registration_enabled',
                'value' => '1',
                'type' => 'boolean',
                'description' => 'Allow new users to register accounts.',
            ],
            [
                'key' => 'max_upload_size_mb',
                'value' => '5',
                'type' => 'number',
                'description' => 'Maximum upload size in MB for product images.',
            ],
            [
                'key' => 'order_request_limit_per_minute',
                'value' => '5',
                'type' => 'number',
                'description' => 'Rate limit for order request submissions per minute.',
            ],
        ]);

        foreach ($defaults as $setting) {
            Setting::query()->firstOrCreate(
                ['key' => $setting['key']],
                $setting,
            );
        }

        return Inertia::render('admin/settings/index', [
            'settings' => Setting::query()
                ->orderBy('key')
                ->get()
                ->map(fn (Setting $setting) => [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'type' => $setting->type,
                    'description' => $setting->description,
                ])
                ->values(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string', 'exists:settings,key'],
            'settings.*.value' => ['nullable'],
        ]);

        foreach ($data['settings'] as $item) {
            Setting::query()
                ->where('key', $item['key'])
                ->update([
                    'value' => is_array($item['value'])
                        ? json_encode($item['value'])
                        : (string) $item['value'],
                ]);
        }

        return to_route('admin.settings.index');
    }
}
