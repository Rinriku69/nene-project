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
            return $this->responseWithToken($token);
        } catch (JWTException $e) {
            return response()->json(['error' => 'error ' . $e->getMessage()], 401);
        }
    }

    function logout(): JsonResponse
    {
        try {
            Auth::guard('api')->logout();
            return response()->json(['message' => 'Logged out successfully'], 200);
        } catch (JWTException $e) {
            return response()->json(['message' => 'an error occurred'], 401);
        }
    }

    function me(): JsonResponse
    {
        $user = Auth::guard('api')->user();
        return response()->json([
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role
        ], 200);
    }

    function refresh(): JsonResponse
    {
        try {
            /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard */
            $guard = Auth::guard('api');
            $token = $guard->refresh();
            return $this->responseWithToken($token);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Refresh token has expired. Please login again.',
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing token.',
            ], 401);
        }
    }

    function responseWithToken($token): JsonResponse
    {
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard */
        $guard = Auth::guard('api');
        $guard->setToken($token);
        $user = $guard->user();
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expired_at' => $guard->getTTL() * 60,
            'user' => [
                'username' => $user->username,
                'email' => $user->email
            ]
        ], 200);
    }
}
