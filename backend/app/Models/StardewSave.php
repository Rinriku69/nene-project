<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StardewSave extends Model
{
    protected $guarded = [];
    function players(): HasMany{
        return $this->hasMany(StardewPlayer::class);
    }
}
