<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Registered;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:20', 'unique:users,username'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'] // หาfield password_confirmation ให้เอง
        ]);

        try {
            $user = new User();
            $user->email = $validated['email'];
            $user->username = $validated['username'];
            $user->password = $validated['password'];
            $user->currency = 800;
            $user->role = "user";
            $user->save();

            event(new Registered($user));

            return response()->json([
                'status' => 'success',
                'message' => 'Registered Successfully'
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    function login(Request $request): JsonResponse
    {
        $credentail = $request->validate([
            'username' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8']
        ]);

        if (Auth::attempt($credentail)) {
            session()->regenerate();
            return response()->json([
                'status' => 'ok',
                'message' => 'Login success'
            ], 200);
        }

        return response()->json([
            'message' => 'username or password is incorrect'
        ], 401);
    }

    function logout()
    {
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();

        return response()->json([
            'message' => 'Logout success'
        ], 200);
    }

    function forgotPassword(Request $request):JsonResponse{
        $request->validate(['email'=>'required|email']);
        Password::sendResetLink($request->only('email'));

        return response()->json([
            'status'=>'ok',
            'message'=>'If email is registered, a reset link will be sent'
        ]);
    }

    function resetPassword(Request $request):JsonResponse{
        $credentails = $request->validate([
            'token'=>'required',
            'email' => 'required|email',
            'password'=>'required|string|min:8|confirmed'
        ]);

        $status = Password::reset($credentails,
        function (User $user, string $password):void{
            $user->forceFill(['password'=>$password])->save();
            event(new PasswordReset($user));
        });


        return $status === Password::PASSWORD_RESET ? response()->json([
        'status'=>'ok',
        'message'=>'Password reset successfully'
        ],200) : 
        response()->json([
        'status'=>'error',
        'message'=>'Password reset fail'.$status
        ],400);
    }
}
