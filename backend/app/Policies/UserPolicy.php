<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    function isAdmin(User $user){
        return $user->role === 'admin';
    }

    function isFriend(User $user){
         return $user->role === 'friend' || $user->role === 'admin';
    }
}
