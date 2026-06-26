<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id','pet_id'])]
class UserPet extends Model
{
    function pets(): BelongsTo{
        return $this->belongsTo(Pet::class);
    }

    function users(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
