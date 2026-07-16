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
        Schema::table('stardew_player_stat', function (Blueprint $table) {
            $table->Integer('items_crafted')->change();
            $table->Integer('items_cooked')->change();
            $table->Integer('fish_caught')->change();
            $table->Integer('monsters_killed')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stardew_player_stat', function (Blueprint $table) {
            //
        });
    }
};
