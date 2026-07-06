<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PetAnimationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'index_y' => $this->index_y,
            'index_x_count' => $this->index_x_count,
            'seconds' => $this->seconds,
            'frame_w' => $this->frame_w,
            'frame_h' => $this->frame_h,
            'is_idle' => $this->is_idle,
            'scale' => $this->scale,
        ];
    }
}
