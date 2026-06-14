<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminItemResource;
use App\Http\Resources\UserResource;
use App\Models\Item;
use App\Models\User;
use App\Notifications\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Notification;
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
            'username' => ['required', 'string', 'max:20', Rule::unique('users', 'username')->ignore($id)],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($id)],
        ]);
        Gate::authorize('isAdmin', Auth::user());
        $user = User::findOrFail($id);
        $user->forceFill($validated)->save();

        return response()->json([
            'message' => 'Successfully Updated ' . $user->username
        ], 200);
    }

    function sendUserNoti(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required','string'],
            'message' => ['required','string'],
        ]);
        Gate::authorize('isAdmin',Auth::user());
        
        $user = User::all();

        Notification::send($user, new UserNotification($validated['title'],$validated['message']));

        return response()->json([
            'message' => 'Notification sent'
        ],200);
    }

    function getAllItems():JsonResponse{
        Gate::authorize('isAdmin',Auth::user());
        $items = Item::orderBy('rarity')->get();

        return response()->json(AdminItemResource::collection($items),200);
    }

    function updateItem(Request $request):JsonResponse{
        Gate::authorize('isAdmin',Auth::user());
        $validated = $request->validate([
            'name' => ['required','string'],
            'description' => ['required', 'string'],
            'url'=>['required','string'],
            'rarity' => ['required','string'],
            'weight' => ['required','integer']
        ]);
        $item = Item::where('id',$request->id)->update($validated);

        return response()->json([
            'message' => 'Successfully Updated'
        ],200);
    }

     function addItem(Request $request):JsonResponse{
        Gate::authorize('isAdmin',Auth::user());
        $validated = $request->validate([
            'name' => ['required','string'],
            'description' => ['required', 'string'],
            'url'=>['required','string'],
            'rarity' => ['required','string'],
            'weight' => ['required','integer']
        ]);
        $item = Item::create($validated);

        return response()->json([
            'message' => 'Successfully Created'
        ],200);
    }
}
