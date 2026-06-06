<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

//Authentication

Route::controller(AuthController::class)
    ->prefix('/auth')
    ->name('auth.')
    ->group(static function():void{
        Route::post('register','register')->name('register');
        Route::post('login','login')->name('login');
    });

Route::middleware((['auth']))
    ->group(static function():void{
        Route::controller(UserController::class)
            ->name('user.')
            ->group(static function():void{
                Route::get('getUser','getUser')->name('getUser');
            });
    });