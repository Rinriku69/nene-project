<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    function getUser(): JsonResponse{
        $user = Auth::user();

        return response()->json([
        'username'=> $user->username,
        'email' => $user->email,
        'currency' => $user->currency,
        'role' => $user->role,
        'last_login_at'=> $user->last_login_at
        ],200);
    }

    function dailyLogin():JsonResponse{
        $user = Auth::user();
        $gems = 300;
        if($this->updateDailyLoginCurrency($gems,$user)){

            return response()->json([
                'message' => 'Gems '. $gems . ' received'
            ],200);
        }

        return response()->json([
            'message' => 'Cannot receive daily login'
        ],403);
    }

    private function updateDailyLoginCurrency(int $amount, User $user): bool{
        
        if(!$user->last_login_at || !$user->last_login_at->isToday()){
            $user->currency += $amount;

            $user->last_login_at = now();

            $user->save();

            return true;
        }

        return false;
    }
}
