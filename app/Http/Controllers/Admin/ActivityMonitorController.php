<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityMonitorController extends Controller
{
    public function index(Request $request): Response
    {
        $userId = $request->string('user_id')->toString();
        $action = $request->string('action')->toString();
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();

        if ($from === '') {
            $from = now()->subDays(30)->toDateString();
        }

        if ($to === '') {
            $to = now()->toDateString();
        }

        $activities = Activity::query()
            ->with('causer')
            ->when($userId !== '', fn ($query) => $query
                ->where('causer_type', User::class)
                ->where('causer_id', $userId))
            ->when($action !== '', fn ($query) => $query
                ->where(function ($subQuery) use ($action) {
                    $subQuery
                        ->where('event', $action)
                        ->orWhere('description', $action);
                }))
            ->whereBetween('created_at', [$from.' 00:00:00', $to.' 23:59:59'])
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Activity $activity) => [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'event' => $activity->event,
                'subject_type' => class_basename((string) $activity->subject_type),
                'subject_id' => $activity->subject_id,
                'causer_name' => $activity->causer?->name,
                'causer_email' => $activity->causer?->email,
                'properties' => $activity->properties?->toArray() ?? [],
                'created_at' => $activity->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('admin/activity/index', [
            'filters' => [
                'user_id' => $userId,
                'action' => $action,
                'from' => $from,
                'to' => $to,
            ],
            'users' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
            'actions' => ['created', 'updated', 'deleted'],
            'activities' => $activities,
        ]);
    }
}
