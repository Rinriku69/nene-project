<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    function verify(Request $request,int $id,string $hash){
        $user = User::query()->findOrFail($id);
        if(! hash_equals(sha1($user->email),$hash)){
            abort(403,'Invalid link');
        }

        if(! $user->hasVerifiedEmail()){
            $user->markEmailAsVerified();

            event(new Verified($user));
        }

        return redirect()->away(config('app.frontend_url').'/auth/login?verified=1');
    }

    function resend(Request $request): JsonResponse
    {
        if($request->user()->hasVerifiedEmail()){
            return response()->json([
                'status'=>'ok',
                'message'=>'Email is already verified'
            ]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'status'=>'ok',
            'message'=>'Verification email sent'
        ]);
    }

}
