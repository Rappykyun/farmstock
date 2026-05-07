<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAccountIsApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        abort_if($user === null, 403);

        if ($user->hasRole('admin') || $user->approval_status === 'approved') {
            return $next($request);
        }

        return redirect()->route('account.pending-approval');
    }
}
