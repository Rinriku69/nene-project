<?php

namespace App\Policies;

use App\Models\Pet;
use App\Models\User;
use App\Models\UserPet;
use Exception;

class PetPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    function isOwned(User $user, Pet $pet): bool
    {
        // dd($petOwned);
        try {
            $petOwned = UserPet::where('user_id', $user->id)
                ->where('pet_id', $pet->id)->firstOrFail();
            return true;
        } catch (Exception $e) {

            return false;
        }
    }
}
