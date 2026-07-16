<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StardewPlayer extends Model
{
    protected $guarded = []; 
    function stardewSave(): BelongsTo{
        return $this->belongsTo(StardewSave::class);
    }

    function skill():HasOne{
        return $this->hasOne(StardewPlayerSkill::class,'player_id','id');
    }

    function stat():HasOne{
        return $this->hasOne(StardewPlayerstat::class,'player_id','id');
    }
}
