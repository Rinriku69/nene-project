<?php

namespace App\Http\Controllers;

use App\Http\Resources\PetAnimationResource;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Models\User;
use App\Models\UserPet;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
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
        $pets = Cache::remember('pet:catalog',now()->addHours(10),function () {
            return Pet::with(['petAnimations' => function ($query){
                $query->where('name','idle1')
                ->orWhere('name','dance')
                ->orWhere('name','standing');
            }])->get();
        });
     
        $petReosurce = PetResource::collection($pets)->resolve();

        $petOwnedIds = UserPet::where('user_id',$user->id)->pluck('pet_id')->all();
        $petShop = array_map(fn($pet) => [...$pet,'is_owned' => in_array($pet['id'],$petOwnedIds)] ,$petReosurce );
        // dd($petShop);
        
        return response()->json($petShop, 200);
    }

    function buyPet(int $id): JsonResponse{
        try{
            $result = DB::transaction(function() use ($id){
                $user = User::where('id',Auth::id())->lockForUpdate()->first();
                $pet = Pet::where('id',$id)->first();
                $petOwnedIds = UserPet::where('user_id',$user->id)->pluck('pet_id')->all();

                if($user->currency < $pet->price){
                    return "Insufficient Currency!";
                }elseif(in_array($id,$petOwnedIds)){
                    return "You already own this pet!";
                }

                $user->currency -= $pet->price;
                $user->save();
                UserPet::create([
                    'user_id'=> $user->id,
                    'pet_id'=> $pet->id
                ]);

                return "Successfully Bought ".$pet->name;
            });

            return response()->json([
                'message'=>$result
            ],200);
        }catch(Exception $e){
            return response()->json([
                'message' => $e->getMessage()
            ]);
        }
    }

    function getAllUserPets(){
        $user = Auth::user();
        $ownedPets = Pet::whereHas('userPets',function ($query) use ($user){
            $query->where('user_id',$user->id);
        })->with(['petAnimations' => function ($query) {
            $query->where('name','idle1');
        }])->get();

        return response()->json(PetResource::collection($ownedPets),200);
    }
}
