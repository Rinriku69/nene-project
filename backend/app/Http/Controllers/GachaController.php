<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Models\Inventory;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GachaController extends Controller
{
    function pull(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pull' => ['required', 'integer', 'max:10']
        ]);
        $rolledItems = DB::transaction(function () use ($request) {
            $user = User::where('id', Auth::id())->lockForUpdate()->first();

            if ($user->currency < ($request->pull * 10)) {
                abort(400, 'Insufficient Coin!');
            }

            $rolledItems = $this->randomPull($request->pull);

            foreach ($rolledItems as $item) {
                Inventory::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'item_id' => $item->id,
                    ],
                    [
                        'quantity' => DB::raw('quantity + 1'),
                    ]
                );
            }
            $user->currency -= $request->pull * 10;
            $user->save();

            return $rolledItems;
        });

        return response()->json([
            'results' => ItemResource::collection($rolledItems),
            'success' => 'ok'
        ], 200);
    }

    private function randomPull($pulls)
    {
        $items = Item::all()->groupBy('rarity');

        $totalWeightByRarity = $items->map(function ($items) {
            return $items->sum('weight');
        });
        $results = [];

        for ($i = 0; $i < $pulls; $i++) {
            $rarity = $this->randomRarity();

            $itemsInThisRarity = $items->get($rarity);
            $totalWeight = $totalWeightByRarity->get($rarity);
            $randomNumber = random_int(1, $totalWeight);
            $currentWeight = 0;
            $pulledItem = null;

            foreach ($itemsInThisRarity as $item) {
                $currentWeight += $item->weight;

                if ($randomNumber <= $currentWeight) {
                    $pulledItem = $item;
                    break;
                }
            }

            if ($pulledItem) {
                $results[] = $pulledItem;
            }
        }

        return $results;
    }

    private function randomRarity()
    {
        $randomInt = random_int(1, 10);
        $rarity = '';
        switch (true) {
            case ($randomInt <= 1):
                $rarity = 'SSR';
                break;
            case ($randomInt <= 3):
                $rarity = 'SR';
                break;
            case ($randomInt <= 6):
                $rarity = 'R';
                break;
            case ($randomInt <= 10):
                $rarity = 'N';
                break;
        }

        return $rarity;
    }
}
