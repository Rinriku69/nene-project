<?php

namespace App\Http\Controllers;

use App\Http\Resources\PetAnimationResource;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Models\UserPet;
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

    function getPetShop(): JsonResponse{
        $user = Auth::user();
        $pets = Pet::with(['petAnimations' => function ($query){
            $query->where('name','idle1')
            ->orWhere('name','dance');
        }])->get();
     
        $petReosurce = PetResource::collection($pets)->resolve();

        $petOwnedIds = UserPet::where('user_id',$user->id)->pluck('pet_id')->all();
        $petShop = array_map(fn($pet) => [...$pet,'is_owned' => in_array($pet['id'],$petOwnedIds)] ,$petReosurce );
        // dd($petShop);

        return response()->json($petShop, 200);
    }
}
