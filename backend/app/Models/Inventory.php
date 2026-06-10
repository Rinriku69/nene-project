<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'item_id'])]
class Inventory extends Model
{

    function items(): BelongsTo{
        return $this->belongsTo(Item::class);
    }

    function users(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
