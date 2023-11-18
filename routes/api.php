<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('/auth')->group(function () {
    Route::post('signup', [App\Http\Controllers\api\member\AuthController::class, 'signup']);
    Route::post('signin', [App\Http\Controllers\api\member\AuthController::class, 'signin']);

    Route::get('redirect/kakao', function () {
        return Socialite::driver('kakao')->stateless()->redirect();
    });
    Route::get('redirect/google', function () {
        return Socialite::driver('google')->stateless()->redirect();
    });
    Route::get('callback/{provider}',[App\Http\Controllers\api\member\SocialController::class, 'callback_test']);

//    Route::middleware('auth:api')->group(function() {
//        Route::get('logout', 'AuthController@logout');
//        Route::get('user', 'AuthController@user');
//    });
});
