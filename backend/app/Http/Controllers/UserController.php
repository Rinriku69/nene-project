<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use App\Models\Inventory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    function getUser(): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'username' => $user->username,
            'email' => $user->email,
            'currency' => $user->currency,
            'role' => $user->role,
            'image_url' => $user->image_url,
            'last_login_at' => $user->last_login_at
        ], 200);
    }

    function dailyLogin(): JsonResponse
    {
        $user = Auth::user();
        $gems = 450;
        // dd($this->updateDailyLoginCurrency($gems,$user));
        if ($this->updateDailyLoginCurrency($gems, $user)) {
            return response()->json([
                'message' => 'Gems ' . $gems . ' received'
            ], 200);
        }

        return response()->json([
            'message' => 'Cannot receive daily login'
        ], 403);
    }

    private function updateDailyLoginCurrency(int $amount, User $user): bool
    {


        if (!$user->last_login_at || !$user->last_login_at->isToday()) {
            $user->currency += $amount;

            $user->last_login_at = now();

            $user->save();

            return true;
        }

        return false;
    }

    public function getInventory(Request $request): JsonResponse
    {
        $inventory = Inventory::where('user_id', Auth::id())
            ->join('items', 'inventories.item_id', '=', 'items.id')
            ->select('items.name', 'items.description', 'items.rarity', 'items.url', 'inventories.quantity')
            ->orderByRaw("CASE WHEN items.rarity = 'SSR' THEN 1 WHEN items.rarity = 'SR' THEN 2 WHEN items.rarity = 'R' THEN 3 WHEN items.rarity = 'N' THEN 4 ELSE 5 END")
            ->paginate(6);

        return response()->json($inventory);
    }

    function getNoti(): JsonResponse
    {
        $user = Auth::user();

        $notifications = $user->notifications;

        return response()->json(NotificationResource::collection($notifications),200);
    }

    function markAsReadAll(){
        $user = Auth::user();

        $user->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'ok'
        ],200);
    }
}
