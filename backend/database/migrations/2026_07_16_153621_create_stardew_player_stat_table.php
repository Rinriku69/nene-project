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
        Schema::create('stardew_player_stat', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained('stardew_players','id');
            $table->unsignedTinyInteger('items_crafted');
            $table->unsignedTinyInteger('items_cooked');
            $table->unsignedTinyInteger('fish_caught');
            $table->unsignedTinyInteger('monsters_kill');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stardew_player_stat');
    }
};
