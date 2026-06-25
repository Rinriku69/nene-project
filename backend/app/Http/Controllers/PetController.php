<?php

namespace App\Http\Controllers;

use App\Http\Resources\PetAnimationResource;
use App\Models\Pet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Ramsey\Uuid\Type\Integer;

class PetController extends Controller
{
    function getUserPet(int $id): JsonResponse
    {
        $findPet = Pet::find($id);
        $user = Auth::user();
        Gate::authorize('isOwned', $findPet);

        $pet = Pet::where('id', $id)->with('petAnimations')
            ->firstOrFail();
        // dd($pet);
        return response()->json([
            'name' => $pet->name,
            'url' => $pet->url,
            'pet_animations'=> PetAnimationResource::collection($pet->petAnimations) 
        ], 200);
    }
}
