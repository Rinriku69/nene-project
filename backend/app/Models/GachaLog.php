<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GachaLog extends Model
{
    function user():HasOne{
        return $this->hasOne(User::class);
    }
    function item():HasOne{
        return $this->hasOne(Item::class);
    }
}
