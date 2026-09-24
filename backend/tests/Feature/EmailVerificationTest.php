<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unverified_user_is_blocked_from_gacha_pull(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user)->postJson('/api/gacha/pull', ['type' => 1]);

        $response->assertStatus(403);
    }

    public function test_verified_user_passes_the_verified_middleware(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/gacha/pull', ['type' => 1]);


        $this->assertNotSame(403, $response->status());
    }

    public function test_resend_sends_the_verification_notification(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create();

        $this->actingAs($user)->postJson('/api/auth/resendVerification')->assertOk();

        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_signed_link_verifies_email_and_redirects_to_frontend(): void
    {
        $user = User::factory()->unverified()->create();

        $url = URL::temporarySignedRoute('verification.verify', now()->addMinutes(60), [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ]);

        $this->get($url)->assertRedirect(config('app.frontend_url').'/auth/login?verified=1');

        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_tampered_verification_link_is_rejected(): void
    {
        $user = User::factory()->unverified()->create();

        $this->get("/api/email/verify/{$user->id}/".sha1($user->email))->assertForbidden();

        $this->assertNull($user->fresh()->email_verified_at);
    }
}
