<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Item extends Model
{
    function gachaLog(): HasMany{
        return $this->hasMany(GachaLog::class);
    }

    function inventory(): HasMany{
        return $this->hasMany(Inventory::class);
    }
}
