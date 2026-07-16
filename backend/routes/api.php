<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\JWTAuthController;
use App\Http\Controllers\GachaController;
use App\Http\Controllers\PetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SafeZoneMessageController;
use App\Http\Controllers\Stardew\StardewController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use PHPOpenSourceSaver\JWTAuth\JWTAuth;

//Authentication

Route::controller(AuthController::class)
    ->prefix('/auth')
    ->name('auth.')
    ->group(static function (): void {
        Route::post('/register', 'register')->name('register');
        Route::post('/login', 'login')->name('login')->middleware('throttle:6,1');
    });

Route::controller(JWTAuthController::class)
    ->prefix('/auth/jwt')
    ->name('auth.jwt.')
    ->group(static function():void{
        Route::post('/login','login')->name('login')->middleware('throttle:6,1');
        Route::post('/refresh','refresh')->name('refresh')->middleware('throttle:6,1');
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
                Route::get('/getNoti', 'getNoti')->name('getNoti');
                Route::post('/markAsReadAll', 'markAsReadAll')->name('markAsReadAll');
            });

        Route::controller(GachaController::class)
            ->prefix('/gacha')
            ->name('gacha.')
            ->group(static function (): void {
                Route::post('/pull', 'pull')->name('pull');
                Route::get('/logs', 'getGachaLogs')->name('logs');
                Route::get('/getFeatureBanner', 'getFeatureBanner')->name('getFeatureBanner');
            });

        Route::controller(AdminController::class)
            ->prefix('/admin')
            ->name('admin.')
            ->group(static function (): void {
                Route::get('/getUserList', 'getUserList')->name('getUserList');
                Route::post('/updateUser/{id}', 'updateUser')->name('updateUser');
                Route::post('/sendUserNoti', 'sendUserNoti')->name('sendUserNoti');
                Route::get('/getAllItems', 'getAllItems')->name('getAllItems');
                Route::post('/updateItem', 'updateItem')->name('updateItem');
                Route::post('/addItem', 'addItem')->name('addItem');
                Route::post('/gemGiveaway', 'gemGiveaway')->name('gemGiveaway');
            });

        Route::controller(GachaController::class)
            ->prefix('/gacha')
            ->name('gacha.')
            ->group(static function (): void {
                Route::post('/pull', 'pull')->name('pull');
            });

        Route::controller(SafeZoneMessageController::class)
            ->prefix('/safezone')
            ->name('safezone.')
            ->group(static function (): void {
                Route::post('/addTanzaku', 'addTanzaku')->name('addTanzaku');
                Route::get('/getMessages', 'getMessages')->name('getMessages');
            });

        Route::controller(ProfileController::class)
            ->prefix('/profile')
            ->name('profile.')
            ->group(static function (): void {
                Route::post('/uploadProfile', 'uploadProfile')->name('uploadProfile');
            });
        
        Route::controller(PetController::class)
            ->prefix('/pet')
            ->name('pet.')
            ->group(static function():void{
                Route::get('/getUserPet/{id}','getUserPet')->name('getUserPet');
                Route::get('/getPetShop','getPetShop')->name('getPetShop');
                Route::post('/buyPet/{id}','buyPet')->name('buyPet');
                Route::get('/getAllUserPets','getAllUserPets')->name('getAllUserPets');
            });
    });

Route::middleware(['auth:api', 'throttle:10,1'])
    ->group(static function():void{
        Route::controller(JWTAuthController::class)
        ->prefix('/auth/jwt')
        ->name('auth.jwt.')
        ->group(static function():void{
            Route::post('/logout','logout')->name('logout');
            Route::get('/me','me')->name('me');
        });

        Route::controller(StardewController::class)
        ->prefix('/stardew')
        ->name('stardew.')
        ->group(static function():void{
            Route::post('/save','save')->name('save');
        });
    });

