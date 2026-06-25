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
        Schema::create('pet_animations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pet_id')->constrained('pets','id');
            $table->string('name');
            $table->integer('index_y');
            $table->integer('index_x_count');
            $table->string('seconds');
            $table->string('frame_w');
            $table->string('frame_h');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pet_animations');
    }
};
