<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserLocationResource;
use App\Models\User;
use App\Models\UserLocation;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'long' => 'required|numeric|between:-180,180',
            'text_status' => 'string|nullable'
        ]);
        $user = Auth::user();
        try {
            if ($user->role !== 'friend' && $user->role !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorize'
                ], 401);
            }
            UserLocation::query()->updateOrCreate(['user_id' => $user->id], $validated);

            return response()->json([
                'status' => 'ok',
                'message' => 'successfully updated location'
            ], 200);
        } catch (QueryException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'update location failed ' . $e->getMessage() 
            ], 400);
        }
    }

    function getFriendLocation(): JsonResponse
    {
        $user = Auth::user();
        if ($user->role !== 'friend' && $user->role !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorize'
            ], 401);
        }

        /* $userLocations = UserLocation::query()->where('user_id', '!=', $user->id)->with(['user' => function ($query) {
            $query->where('role', 'friend')
                ->orWhere('role', 'admin')
                ->select('id', 'username', 'image_url');
        }])->get(); */

        $userLocations = UserLocation::query()->where('user_id','!=',$user->id)->whereHas('user', function ($query){
            $query->where('role','friend')
            ->orWhere('role','admin');
        })->with('user:id,username,image_url')->get();

        return response()->json(UserLocationResource::collection($userLocations),200);
    }
}
