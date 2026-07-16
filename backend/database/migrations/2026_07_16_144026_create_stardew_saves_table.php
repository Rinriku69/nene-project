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
        Schema::create('stardew_saves', function (Blueprint $table) {
            $table->id();
            $table->string('save_id')->nullable(false);
            $table->string('farm_name',30);
            $table->string('game_version',15);
            $table->string('mod_version',15);
            $table->unsignedTinyInteger('day');
            $table->string('season',15);
            $table->unsignedTinyInteger('year');
            $table->integer('money');
            $table->integer('total_money_earned');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stardew_saves');
    }
};
