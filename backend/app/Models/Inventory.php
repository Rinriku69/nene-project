<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Inventory extends Model
{
    function items(): HasOne{
        return $this->hasOne(Item::class);
    }

    function users(): HasOne{
        return $this->hasOne(User::class);
    }
}
