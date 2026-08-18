<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id','lat','long','text_status'])]
class UserLocation extends Model
{
    function user(): BelongsTo{
        return $this->belongsTo(User::class,'user_id','id');
    }
}
