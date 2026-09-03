<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserLocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id'=>$this->user->id,
            'username'=> $this->user->username,
            'image_url'=> $this->user->image_url,
            'lat'=> $this->lat,
            'long'=>$this->long,
            'text_status'=>$this->text_status,
            'updated'=> $this->updated_at,
            'is_online'=> $this->updated_at >= now()->subMinutes(5) ? true : false
        ];
    }
}
