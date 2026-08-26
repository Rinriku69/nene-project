<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\JWTAuthController;
use App\Http\Controllers\GachaController;
use App\Http\Controllers\LocationController;
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
        Route::post('/register', 'register')->name('register')->middleware('throttle:6,1');
        Route::post('/login', 'login')->name('login')->middleware('throttle:6,1');
        Route::post('/forgotPassword','forgotPassword')->name('forgotPassword')->middleware('throttle:6,1');
        Route::post('/resetPassword','resetPassword')->name('resetPassword')->middleware('throttle:6,1');
    });

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');

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
        Route::post('/auth/resendVerification', [EmailVerificationController::class, 'resend'])->name('auth.resendVerification')->middleware('throttle:10,1');

        Route::controller(UserController::class)
            ->name('user.')
            ->group(static function (): void {
                Route::get('/getUser', 'getUser')->name('getUser')->middleware('throttle:60,1');
                Route::post('/getDailyLogin', 'dailyLogin')->name('dailyLogin')->middleware('throttle:60,1');;
                Route::get('/getInventory', 'getInventory')->name('getInventory')->middleware('throttle:60,1');;
                Route::get('/getNoti', 'getNoti')->name('getNoti')->middleware('throttle:60,1');;
                Route::post('/markAsReadAll', 'markAsReadAll')->name('markAsReadAll')->middleware('throttle:10,1');;
            });

        Route::controller(GachaController::class)
            ->prefix('/gacha')
            ->name('gacha.')
            ->group(static function (): void {
                Route::post('/pull', 'pull')->name('pull')->middleware(['throttle:60,1', 'verified']);
                Route::get('/logs', 'getGachaLogs')->name('logs')->middleware('throttle:60,1');;
                Route::get('/getFeatureBanner', 'getFeatureBanner')->name('getFeatureBanner')->middleware('throttle:60,1');;
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

        Route::controller(SafeZoneMessageController::class)
            ->prefix('/safezone')
            ->name('safezone.')
            ->group(static function (): void {
                Route::post('/addTanzaku', 'addTanzaku')->name('addTanzaku')->middleware(['throttle:30,1', 'verified']);
                Route::get('/getMessages', 'getMessages')->name('getMessages')->middleware('throttle:60,1');
            });

        Route::controller(ProfileController::class)
            ->prefix('/profile')
            ->name('profile.')
            ->group(static function (): void {
                Route::post('/uploadProfile', 'uploadProfile')->name('uploadProfile')->middleware(['throttle:10,1','verified']);
            });
        
        Route::controller(PetController::class)
            ->prefix('/pet')
            ->name('pet.')
            ->group(static function():void{
                Route::get('/getUserPet/{id}','getUserPet')->name('getUserPet')->middleware('throttle:60,1');
                Route::get('/getPetShop','getPetShop')->name('getPetShop')->middleware('throttle:60,1');
                Route::post('/buyPet/{id}','buyPet')->name('buyPet')->middleware(['throttle:60,1', 'verified']);
                Route::get('/getAllUserPets','getAllUserPets')->name('getAllUserPets')->middleware('throttle:60,1');
            });

        Route::controller(StardewController::class)
            ->prefix('/stardew')
            ->name('stardew.')
            ->group(static function():void{
                Route::get('/getSaves','getSaves')->name('getSaves')->middleware('throttle:30,1');
            });

        Route::controller(LocationController::class)
            ->prefix('/location')
            ->name('location.')
            ->group(static function():void{
                Route::post('/update','update')->name('update')->middleware(['throttle:60,1','verified']);
                Route::get('/getFriendLocation','getFriendLocation')->name('getFriendLocation')->middleware(['throttle:60,1','verified']);
                Route::get('/getMyLocation','getMyLocation')->name('getMyLocation')->middleware(['throttle:60,1','verified']);
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
            Route::post('/saves','save')->name('saves')->middleware(['throttle:10,1','verified']);
            Route::post('/avatar','uploadAvatar')->name('avatar')->middleware(['throttle:10,1','verified']);
        });
    });

