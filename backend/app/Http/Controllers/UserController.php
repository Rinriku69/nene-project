<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    function getUser(): JsonResponse{
        $user = Auth::user();

        return response()->json([
        'username'=> $user->username,
        'email' => $user->email
        ],200);
    }
}
