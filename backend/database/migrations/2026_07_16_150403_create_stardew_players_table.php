<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stardew_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('save_id')->constrained('stardew_saves','id');
            $table->string('player_id');
            $table->boolean('is_host');
            $table->timestamp('sent_at');
            $table->integer('play_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stardew_players');
    }
};
