<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Dotenv\Repository\RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

class JWTAuthController extends Controller
{
    function login(Request $request): JsonResponse
    {
        $credentail = $request->validate([
            'username' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8']
        ]);
        try {
            if (!$token = Auth::guard('api')->attempt($credentail)) {
                return response()->json(['error' => 'Username or Password is incorrect'], 401);
            }
            return response()->json(['access_token' => $token], 200);
        } catch (JWTException $e) {
            return response()->json('error ' . $e->getMessage());
        }
    }

    function logout(): JsonResponse{
        try{
            Auth::guard('api')->logout();
            return response()->json(['message'=>'Logged out successfully'],200);

        }catch(JWTException $e){
            return response()->json(['message'=>'an error occurred']);
        }
    }

    function me(): JsonResponse{
        $user = Auth::guard('api')->user();
        return response()->json([
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role
        ],200);
    }
}
