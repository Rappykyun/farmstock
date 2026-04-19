<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class LandingPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration())
                && filter_var(Setting::getValue('registration_enabled', '1'), FILTER_VALIDATE_BOOL),
        ]);
    }
}
