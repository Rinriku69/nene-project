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
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'long' => 'required|numeric|between:-180,180',
            'text_status' => 'string|nullable|max:50'
        ]);
        $user = Auth::user();
        Gate::authorize('isFriend',$user);
        try {
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
        Gate::authorize('isFriend',$user);

        $userLocations = UserLocation::query()->where('user_id','!=',$user->id)->whereHas('user', function ($query){
            $query->where('role','friend')
            ->orWhere('role','admin');
        })->with('user:id,username,image_url')->get();

        return response()->json(UserLocationResource::collection($userLocations),200);
    }

    function getMyLocation(): JsonResponse
    {
        $user = Auth::user();
        Gate::authorize('isFriend',$user);
        $userLocation = UserLocation::query()->where('user_id',$user->id)
            ->with('user:id,username,image_url')->first();

        return response()->json($userLocation ? new UserLocationResource($userLocation) : null, 200);
    }
}
