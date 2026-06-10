<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class AdminController extends Controller
{
    function getuserList(): JsonResponse
    {
        Gate::authorize('isAdmin', Auth::user());

        $userList = User::paginate(10);

        return response()->json(
            $userList,
        );
    }
}
