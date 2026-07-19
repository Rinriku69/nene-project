<?php

namespace App\Models;

use App\Notifications\ResetPasswordNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

#[Fillable(['username', 'email', 'password', 'image_url'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements JWTSubject,MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login_at' => 'datetime'
        ];
    }

    #[\Override]
    public function sendPasswordResetNotification($token)
    {
        $url = config('app.frontend_url').'/auth/resetPassword?token='.$token.'&email='.urlencode($this->email);
        $this->notify(new ResetPasswordNotification($url));
    }

    function getJWTIdentifier()
    {
        return $this->getKey();
    }
    
    function getJWTCustomClaims(): array
    {
        return [
            'username'=> $this->username,
            'email'=>$this->email,
            'role' => $this->role,
        ];
    }

    function inventory(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    function gachaLogs(): HasMany
    {
        return $this->hasMany(GachaLog::class);
    }

    function safeZoneMessages(): HasMany
    {
        return $this->hasMany(SafeZoneMessage::class);
    }

    function userPets(): HasMany
    {
        return $this->hasMany(UserPet::class);
    }


}
