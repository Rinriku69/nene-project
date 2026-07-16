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
        Schema::create('stardew_player_skill', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained('stardew_players','id');
            $table->unsignedTinyInteger('farming');
            $table->unsignedTinyInteger('mining');
            $table->unsignedTinyInteger('foraging');
            $table->unsignedTinyInteger('fishing');
            $table->unsignedTinyInteger('combat');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stardew_player_skill');
    }
};
