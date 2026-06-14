<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\GachaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

//Authentication

Route::controller(AuthController::class)
    ->prefix('/auth')
    ->name('auth.')
    ->group(static function (): void {
        Route::post('/register', 'register')->name('register');
        Route::post('/login', 'login')->name('login');
    });

Route::middleware((['auth']))
    ->group(static function (): void {
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

        Route::controller(UserController::class)
            ->name('user.')
            ->group(static function (): void {
                Route::get('/getUser', 'getUser')->name('getUser');
                Route::post('/getDailyLogin', 'dailyLogin')->name('dailyLogin');
                Route::get('/getInventory', 'getInventory')->name('getInventory');
                Route::get('/getNoti','getNoti')->name('getNoti');
                Route::post('/markAsReadAll','markAsReadAll')->name('markAsReadAll');
            });

        Route::controller(GachaController::class)
            ->prefix('/gacha')
            ->name('gacha')
            ->group(static function (): void {
                Route::post('/pull', 'pull')->name('pull');
                Route::get('/logs', 'getGachaLogs')->name('logs');
            });

        Route::controller(AdminController::class)
            ->prefix('/admin')
            ->name('admin.')
            ->group(static function (): void {
                Route::get('/getUserList', 'getUserList')->name('getUserList');
                Route::post('/updateUser/{id}', 'updateUser')->name('updateUser');
                Route::post('/sendUserNoti','sendUserNoti')->name('sendUserNoti');
            });

        Route::controller(GachaController::class)
            ->prefix('/gacha')
            ->name('gacha')
            ->group(static function (): void {
                Route::post('/pull', 'pull')->name('pull');
            });
    });
