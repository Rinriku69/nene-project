<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StardewPlayerSkill extends Model
{
    protected $table = 'stardew_player_skill';
    protected $guarded = [];
    function player(): BelongsTo{
        return $this->belongsTo(StardewPlayer::class,'player_id','id');
    }
}
