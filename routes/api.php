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
    Route::post('logout', [App\Http\Controllers\api\member\AuthController::class, 'logout']);

    Route::get('redirect/kakao', function () {
        return Socialite::driver('kakao')->stateless()->redirect();
    });
    Route::get('redirect/google', function () {
        return Socialite::driver('google')->stateless()->redirect();
    });
    Route::get('callback/{provider}',[App\Http\Controllers\api\member\AuthController::class, 'callback']);

    Route::get('snsSignup/{provider?}', function ($provider=null) {
        return response()->json([
            'message' => 'please sns Signup',
            'state' => "S",
            'data' => $provider
        ], 200);
    })->name('snsSignup');

//    Route::get('snsSignup/{provider?}', function ($provider=null) {
//        return view('auth/snsSignup',['provider'=>$provider]);
//    })->name('snsSignup');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user',[App\Http\Controllers\api\member\AuthController::class, 'user']);
        Route::get('/logout',[App\Http\Controllers\api\member\AuthController::class, 'logout']);
    });

});

/*
    Team
*/
Route::prefix('/teams')->group(function () {
    Route::post('', [App\Http\Controllers\api\team\TeamController::class, 'storeTeam']);
    Route::get('', [App\Http\Controllers\api\team\TeamController::class, 'indexTeams']);
    Route::post('/searchTeams', [App\Http\Controllers\api\team\TeamController::class, 'searchTeams']);
    Route::get('/{sid}', [App\Http\Controllers\api\team\TeamController::class, 'showTeam']);
});
