<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['message','theme_color','pos_x','pos_y','unlocked_at'])]
class SafeZoneMessage extends Model
{
    use HasUuids;

    protected $keyType = 'string';

    public $incrementing = false;

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }


    function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }
}
