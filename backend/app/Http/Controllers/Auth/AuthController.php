<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            $user->email = $request['email'];
            $user->username = $request['username'];
            $user->password = $request['password'];
            $user->role = "user";
            $user->save();

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

    function login(Request $request): JsonResponse{
       $credentail = $request->validate([
        'username'=>['required', 'string', 'max:20'],
        'password'=>['required','string','min:8']
       ]);

       if(Auth::attempt($credentail)){
        session()->regenerate();
        return response()->json([
            'status' => 'ok',
            'message'=>'Login success'
        ],200);
       }

       return response()->json([
        'message' => 'username or password is incorrect'
       ],401);
    }

    function logout(){
        Auth::logout();
        session()->invalidate();
        session()->regenerateToken();

        return response()->json([
        'message'=>'Logout success'
        ],200);
    }
}
