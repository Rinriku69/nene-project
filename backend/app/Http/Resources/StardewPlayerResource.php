<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StardewPlayerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'player_id' => $this->id,
            'farmer_name' => $this->farmer_name,
            'is_host' => $this->is_host,
            'play_time' => $this->play_time,
            'sent_at'=>$this->sent_at,
            'skill'=> [
                'farming'=> $this->skill->farming,
                'mining'=> $this->skill->mining,
                'foraging'=> $this->skill->foraging,
                'fishing'=> $this->skill->fishing,
                'combat'=> $this->skill->combat,
            ],
            'stat'=>[
                'items_crafted'=> $this->stat->items_crafted,
                'items_cooked'=> $this->stat->items_cooked,
                'fish_caught'=> $this->stat->fish_caught,
                'monsters_killed'=> $this->stat->monsters_killed,
            ]
        ];
    }
}
