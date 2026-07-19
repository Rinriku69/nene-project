<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Auth\Notifications\ResetPassword;
use Override;

class ResetPasswordNotification extends ResetPassword implements ShouldQueue
{
    use Queueable;

    public string $url;

    
    function __construct(string $url)
    {
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(mixed $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    #[\Override]
    public function toMail(mixed $notifiable): MailMessage
    {   
        return new MailMessage()
            ->subject('Reset your password')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $this->url)
            ->line('Your password reset will expired in '.config('auth.passwords.users.expire').' minutes')
            ->line('If you did not request a password reset, no further action is required.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
