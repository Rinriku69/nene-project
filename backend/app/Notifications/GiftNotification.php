<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GiftNotification extends Notification
{
    use Queueable;

    protected string $title;
    protected string $message;
    protected int $amount;
    /**
     * Create a new notification instance.
     */
    public function __construct(string $title,string $message,int $amount)
    {
        $this->title = $title;
        $this->message = $message;
        $this->amount = $amount;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }



    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title'=> $this->title,
            'message'=> $this->message,
            'amount' => $this->amount
        ];
    }
}
