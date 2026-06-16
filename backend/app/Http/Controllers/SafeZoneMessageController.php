<?php

namespace App\Http\Controllers;

use App\Models\SafeZoneMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SafeZoneMessageController extends Controller
{
    function addTanzaku(Request $request):JsonResponse{
        $validated = $request->validate([
            'message'=>['required','string'],
            'theme_color'=>['required','string'],
            'pos_x'=>['required','numeric'],
            'pos_y'=>['required','numeric'],
            'unlocked_at'=>['nullable','date_format:Y-m-d']
        ]);
        $user = Auth::user();   
        $expired_at = isset($validated['unlocked_at']) ? $validated['unlocked_at']->copy()->addDay() : now()->addDay();
        /* SafeZoneMessage::create([
            ...$validated,
            'user_id' => $user->id,
            'expired_at' => $expired_at
        ]); */
        $message = new SafeZoneMessage($validated);
        $message->user_id = $user->id;
        $message->expired_at = $expired_at;
        $message->save();
        
        return response()->json([
            'message' => 'Successfully added'
        ],200);
    }
}
