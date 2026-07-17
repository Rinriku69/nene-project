<?php

namespace App\Http\Controllers\Stardew;

use App\Http\Controllers\Controller;
use App\Http\Resources\StardewSaveResource;
use App\Models\StardewPlayer;
use App\Models\StardewSave;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

class StardewController extends Controller
{
    function save(Request $request): JsonResponse
    {
        try {
            $user = Auth::guard('api')->user();
            $skills = $request->skills;
            $stats = $request->stats;
            DB::transaction(function () use ($user, $skills, $stats, $request) {

                $save = StardewSave::query()->updateOrCreate(['save_id' => $request->saveId], [
                    'save_id' => $request->saveId,
                    'farm_name' => $request->farmName,
                    'game_version' => $request->gameVersion,
                    'mod_version' => $request->modVersion,
                    'day' => $request->day,
                    'season' => $request->season,
                    'year' => $request->year,
                    'money' => $request->money,
                    'total_money_earned' => $request->totalMoneyEarned
                ]);

                $player = StardewPlayer::query()->updateOrCreate(['user_id' => $user->id], [
                    'save_id' => $save->id,
                    'player_id' => (string)$request->uniqueMultiplayerID,
                    'user_id' => $user->id,
                    'is_host' => $request->isHost,
                    'farmer_name' => $request->farmerName,
                    'sent_at' => Carbon::parse($request->sentAtUtc),
                    'play_time' => $request->playtimeMs
                ]);

                $player->skill()->updateOrCreate([], [
                    'player_id' => $player->id,
                    'farming' => $skills["farming"],
                    'mining' => $skills["mining"],
                    'foraging' => $skills["foraging"],
                    'fishing' => $skills["fishing"],
                    'combat' => $skills["combat"]
                ]);

                $player->stat()->updateOrCreate([], [
                    'player_id' => $player->id,
                    'items_crafted' => $stats["itemsCrafted"],
                    'items_cooked' => $stats["itemsCooked"],
                    'fish_caught' => $stats["fishCaught"],
                    'monsters_killed' => $stats["monstersKilled"],
                ]);
            });
            return response()->json([
                'message' => 'Save stored Successfully'
            ], 200);
        } catch (TokenExpiredException $e) {

            return response()->json([
                'error' => "Token expired"
            ], 401);
        } catch (TokenInvalidException $e) {

            return response()->json([
                'error' => "Token invalid"
            ], 401);
        } catch (QueryException $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 401);
        } catch (JWTException $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 401);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    function getSaves(): JsonResponse
    {
        try {
            $user = Auth::user();
            $saves = StardewSave::query()->with('players',function ($query){
                $query->with('skill')
                ->with('stat');
            })->whereHas('players',function($query) use ($user){
                $query->where('user_id',$user->id);
            })->get();
            return response()->json(StardewSaveResource::collection($saves), 200);
        } catch (QueryException $e) {

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

   


}
