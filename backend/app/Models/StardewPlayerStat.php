<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StardewPlayerStat extends Model
{
    protected $guarded = [];
    function player(): BelongsTo{
        return $this->belongsTo(StardewPlayer::class);
    }
}
