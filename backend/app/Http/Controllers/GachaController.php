<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Models\GachaLog;
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

            if ($user->currency < ($request->pull * 100)) {
                abort(400, 'Insufficient Coin!');
            }

            $rolledItems = $this->randomPull($request->pull);

            $itemCounts = collect($rolledItems)->countBy('id');

            foreach ($itemCounts as $itemId => $count) {
                $inventory = Inventory::firstOrNew([
                    'user_id' => $user->id,
                    'item_id' => $itemId,
                ]);

                $inventory->quantity = ($inventory->quantity ?? 0) + $count;

                $inventory->save();
            }
            $user->currency -= $request->pull * 100;
            $user->save();

            $now = now();

            $logPayload = [];

            foreach ($rolledItems as $item) {
                $logPayload[] = [
                    'user_id' => $user->id,
                    'item_id' => $item->id,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            }

            GachaLog::insert($logPayload);

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
            if ($i == 9 && $pulls == 10) {
                $hasSr = collect($results)->contains(function ($item) {
                    return in_array($item->rarity, ['SR', 'SSR']);
                });
                if (!$hasSr) {
                    $rarity = 'SR';
                } else {
                    $rarity = $this->randomRarity();
                }
            } else {
                $rarity = $this->randomRarity();
            }


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
        $randomInt = random_int(1, 100);
        $rarity = '';
        switch (true) {
            case ($randomInt <= 2):
                $rarity = 'SSR';
                break;
            case ($randomInt <= 9):
                $rarity = 'SR';
                break;
            case ($randomInt <=  31):
                $rarity = 'R';
                break;
            case ($randomInt <= 100):
                $rarity = 'N';
                break;
        }

        return $rarity;
    }

    public function getGachaLogs(Request $request): JsonResponse
    {
        $logs = GachaLog::where('user_id', Auth::id())
            ->join('items', 'gacha_logs.item_id', '=', 'items.id')
            ->select('items.name', 'gacha_logs.created_at')
            ->orderBy('gacha_logs.created_at', 'desc')
            ->paginate(10);

        return response()->json(
            $logs
        );
    }
}
