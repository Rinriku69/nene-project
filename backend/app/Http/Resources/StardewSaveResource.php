<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StardewSaveResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'farm_name' => $this->farm_name,
            'game_version' => $this->game_version,
            'mod_version' => $this->mod_version,
            'day' => $this->day,
            'season' => $this->season,
            'year' => $this->year,
            'money' => $this->money,
            'total_money_earned' => $this->total_money_earned,
            'players'=>StardewPlayerResource::collection($this->players)
        ];
    }
}
