<?php

namespace App\Http\Controllers;

use App\Models\SafeZoneMessage;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class SafeZoneMessageController extends Controller
{
    function addTanzaku(Request $request):JsonResponse{
        $user = Auth::user();
        $validated = $request->validate([
            'message'=>['required','string'],
            'theme_color'=>['required','string'],
            'pos_x'=>['required','numeric'],
            'pos_y'=>['required','numeric'],
            'unlocked_at'=>['nullable','date_format:Y-m-d'],
            'is_public'=>['nullable','boolean']
        ]);
        $unlocked_at = $validated['unlocked_at'];
        // dd($unlocked_at);
        $expired_at = isset($validated['unlocked_at']) ? Carbon::parse($unlocked_at)->addDay() : now()->addDay();
        /* SafeZoneMessage::create([
            ...$validated,
            'user_id' => $user->id,
            'expired_at' => $expired_at
        ]); */
        $message = new SafeZoneMessage($validated);
        $message->user_id = $user->id;
        $message->expired_at = $expired_at;
        $message->is_public = Gate::allows('isFriend', $user)
            ? $request->boolean('is_public')
            : true;
        $message->save();
        
        return response()->json([
            'message' => 'Successfully added'
        ],200);
    }

    function getMessages(Request $request):JsonResponse{
        $user = Auth::user();
        $now = now();
        $query = SafeZoneMessage::where('expired_at','>',$now);
        $visibility = $request->input('visibility');
        if($visibility === 'private'){
            Gate::authorize('isFriend',$user);
            $query->where('is_public',false);
        }else{
            $query->where('is_public',true);
        }


        $activeMessages = $query
        ->with('user:id,username,image_url')
        ->get();
        
        $transformMessages = $activeMessages->map(function ($msg) use ($now){
            $isLocked = $msg->unlocked_at > $now;

            return [
                'username' => $msg->user->username,
                'image_url' => $msg->user->image_url,
                'pos_x' => $msg->pos_x,
                'pos_y' => $msg->pos_y,
                'message' => $isLocked ? 'This message will unlock in the future' : $msg->message,
                'theme_color' => $msg->theme_color,
                'created_at' => $msg->created_at->format('Y-m-d H:i'),
                'unlocked_at' => $msg->unlocked_at,
                'expired_at' => $msg->expired_at,
                'is_locked' => $isLocked,
                'is_public' => $msg->is_public
            ];
        });

        return response()->json($transformMessages,200);
    }
}
