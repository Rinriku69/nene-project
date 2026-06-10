<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

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
            })->when($role, function ($query, $role) {
                $query->where('role', $role);
            })
            ->paginate(10);

        return response()->json(
            $userList,
        );
    }

    function updateUser(Request $request, $id)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:user,admin,friend'],
            'currency' => ['required', 'integer', 'min:0'],
            'username' => ['required', 'string', 'max:20', Rule::unique('users','username')->ignore($id)],
            'email' => ['required', 'email', Rule::unique('users','email')->ignore($id)],
        ]);
        Gate::authorize('isAdmin', Auth::user());
        $user = User::findOrFail($id);
        $user->forceFill($validated)->save();

        return response()->json([
            'message' => 'Successfully Updated ' . $user->username
        ],200);
    }
}
