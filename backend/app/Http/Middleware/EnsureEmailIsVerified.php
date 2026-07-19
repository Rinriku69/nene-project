<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;

class EnsureEmailIsVerified
{
    /**
     * Replaces Laravel's built-in 'verified' middleware, which redirects to a
     * 'verification.notice' Blade route that does not exist in this API-only app.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if(! $request->user()?->hasVerifiedEmail()||
           ! $request->user() instanceof MustVerifyEmail){
            abort(403, 'Your email address is not verified.');
        }

        return $next($request);
    }
}
