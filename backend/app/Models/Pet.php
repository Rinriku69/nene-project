<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pet extends Model
{
    function petAnimations(): HasMany{
        return $this->hasMany(PetAnimation::class);
    }
    
    function userPets(): HasMany{
        return $this->hasMany(UserPet::class);
    }
}
