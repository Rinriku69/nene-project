<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title'=> $this->data['title'],
            'message' => $this->data['message'],
            'notification_date' => $this->created_at->format('Y-m-d H:i'),
            'read_at' => $this->read_at
        ];
    }
}
