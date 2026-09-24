<?php

namespace Tests\Feature;

use App\Models\GachaLog;
use App\Models\Inventory;
use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GachaPullTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (['N', 'R', 'SR', 'SSR'] as $rarity) {
            Item::create([
                'name' => "Test {$rarity}",
                'description' => 'test item',
                'url' => 'test.png',
                'weight' => 1,
                'rarity' => $rarity,
            ]);
        }
    }

    public function test_single_pull_spends_100_coins_and_gives_one_item(): void
    {
        $user = User::factory()->create(['currency' => 1000, 'role' => 'user']);

        $response = $this->actingAs($user)->postJson('/api/gacha/pull', ['pull' => 1]);

        $response->assertOk()->assertJsonCount(1, 'results');
        $this->assertSame(900, $user->fresh()->currency);
        $this->assertSame(1, GachaLog::where('user_id', $user->id)->count());
        $this->assertSame(1, (int) Inventory::where('user_id', $user->id)->sum('quantity'));
    }

    public function test_ten_pull_always_contains_at_least_one_sr_or_better(): void
    {
        $user = User::factory()->create(['currency' => 1000, 'role' => 'user']);

        for ($run = 0; $run < 20; $run++) {
            $user->forceFill(['currency' => 1000])->save();

            $rarities = $this->actingAs($user)
                ->postJson('/api/gacha/pull', ['pull' => 10])
                ->assertOk()
                ->json('results.*.rarity');

            $this->assertNotEmpty(array_intersect(['SR', 'SSR'], $rarities));
        }
    }

    public function test_pull_is_rejected_when_user_cannot_afford_it(): void
    {
        $user = User::factory()->create(['currency' => 50, 'role' => 'user']);

        $this->actingAs($user)->postJson('/api/gacha/pull', ['pull' => 1])->assertStatus(400);

        $this->assertSame(50, $user->fresh()->currency);
        $this->assertSame(0, GachaLog::count());
    }

    public function test_zero_or_negative_pull_count_is_rejected(): void
    {
        $user = User::factory()->create(['currency' => 1000, 'role' => 'user']);

        foreach ([0, -5] as $pull) {
            $this->actingAs($user)->postJson('/api/gacha/pull', ['pull' => $pull])->assertStatus(422);
        }

        $this->assertSame(1000, $user->fresh()->currency);
    }

    public function test_non_admin_cannot_use_admin_endpoints(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)->postJson('/api/admin/gemGiveaway', ['amount' => 99999])->assertForbidden();
    }
}
