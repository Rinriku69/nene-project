<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PetAnimation extends Model
{
    function pet(): BelongsTo{
        return $this->belongsTo(Pet::class);
    }
}
