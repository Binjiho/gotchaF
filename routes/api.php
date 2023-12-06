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

    Route::get('snsSignup/{provider?}', function ($email=null, $provider=null) {
        return response()->json([
            'message' => 'please sns Signup',
            'state' => "S",
            'data' => ["email" => $email, "provider" => $provider],
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
|--------------------------------------------------------------------------
| TEAM
|--------------------------------------------------------------------------
*/
Route::prefix('/teams')->group(function () {
    Route::get('', [App\Http\Controllers\api\team\TeamController::class, 'indexTeams']);
    Route::post('/searchTeams', [App\Http\Controllers\api\team\TeamController::class, 'searchTeams']);
    Route::get('/{sid}', [App\Http\Controllers\api\team\TeamController::class, 'showTeam']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('', [App\Http\Controllers\api\team\TeamController::class, 'storeTeam']);
        Route::post('/{sid}', [App\Http\Controllers\api\team\TeamController::class, 'updateTeam']);
        Route::post('/signup/{sid}', [App\Http\Controllers\api\team\TeamAuthController::class, 'signupTeam']);
        Route::post('/waitup/{sid}', [App\Http\Controllers\api\team\TeamAuthController::class, 'waitupTeam']);
        Route::post('/confirm', [App\Http\Controllers\api\team\TeamAuthController::class, 'confirm']);
        Route::post('/mendate', [App\Http\Controllers\api\team\TeamAuthController::class, 'mendate']);
        Route::post('/delete-member', [App\Http\Controllers\api\team\TeamAuthController::class, 'delete']);
        Route::post('/manager-member', [App\Http\Controllers\api\team\TeamAuthController::class, 'manager']);
        Route::post('/board-notice', [App\Http\Controllers\api\team\TeamController::class, 'notice']);
        Route::post('/board-gallery', [App\Http\Controllers\api\team\TeamController::class, 'gallery']);
    });
});

/*
|--------------------------------------------------------------------------
| BOARD
|--------------------------------------------------------------------------
*/
Route::prefix('/boards')->group(function () {
    Route::post('', [App\Http\Controllers\api\board\BoardController::class, 'storeBoard']);
    Route::get('', [App\Http\Controllers\api\board\BoardController::class, 'indexBoards']);
    Route::get('/{sid}', [App\Http\Controllers\api\board\BoardController::class, 'showBoard']);
    Route::patch('/{sid}', [App\Http\Controllers\api\board\BoardController::class, 'updateBoard']);

    Route::get('/board-gallery/{sid}', [App\Http\Controllers\api\board\BoardController::class, 'indexGallery']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/board-notice', [App\Http\Controllers\api\team\TeamController::class, 'notice']);
        Route::post('/board-gallery/{sid}', [App\Http\Controllers\api\board\BoardController::class, 'storeGallery']);
    });
});
