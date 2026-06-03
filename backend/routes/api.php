<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

//Authentication

Route::controller(AuthController::class)
    ->prefix('/auth')
    ->name('auth.')
    ->group(static function():void{
        Route::post('register','register')->name('register');
    });