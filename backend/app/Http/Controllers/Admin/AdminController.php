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
    function getuserList(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $role = $request->input('role');
        Gate::authorize('isAdmin', Auth::user());

        $userList = User::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('username', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%");
                });
            })->when($role,function ($query,$role){
                $query->where('role',$role);
            })
            ->paginate(10);

        return response()->json(
            $userList,
        );
    }
}
