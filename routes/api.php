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
| MyPage
|--------------------------------------------------------------------------
*/
Route::prefix('/mypage')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('', [App\Http\Controllers\api\mypage\MypageController::class, 'indexMypage']);
        Route::get('/detail', [App\Http\Controllers\api\mypage\MypageController::class, 'showMypage']);
        Route::post('', [App\Http\Controllers\api\mypage\MypageController::class, 'updateUser']);
        Route::post('/thum', [App\Http\Controllers\api\mypage\MypageController::class, 'storeThum']);
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
    Route::get('/detail-match/{tid}', [App\Http\Controllers\api\team\TeamController::class, 'showTeamMatch']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('', [App\Http\Controllers\api\team\TeamController::class, 'storeTeam']);
        Route::post('/{sid}', [App\Http\Controllers\api\team\TeamController::class, 'updateTeam']);
        Route::post('/signup/{sid}', [App\Http\Controllers\api\team\TeamAuthController::class, 'signupTeam']);
        Route::post('/waitup/{sid}', [App\Http\Controllers\api\team\TeamAuthController::class, 'waitupTeam']);
        Route::post('/confirm', [App\Http\Controllers\api\team\TeamAuthController::class, 'confirm']);
        Route::post('/mendate', [App\Http\Controllers\api\team\TeamAuthController::class, 'mendate']);
        Route::post('/delete-team/{tid}', [App\Http\Controllers\api\team\TeamController::class, 'deleteTeam']);
//        Route::post('/delete-member', [App\Http\Controllers\api\team\TeamAuthController::class, 'delete']);
        Route::post('/manager-member', [App\Http\Controllers\api\team\TeamAuthController::class, 'manager']);
        Route::post('/board-notice', [App\Http\Controllers\api\team\TeamController::class, 'notice']);
        Route::post('/board-gallery', [App\Http\Controllers\api\team\TeamController::class, 'gallery']);
    });
});

/*
|--------------------------------------------------------------------------
| COMPETITION
|--------------------------------------------------------------------------
*/
Route::prefix('/competitions')->group(function () {
    Route::get('{type?}{sorting?}', [App\Http\Controllers\api\competition\CompetitionController::class, 'indexCompetition']); //전체
    Route::post('/search', [App\Http\Controllers\api\competition\CompetitionController::class, 'searchCompetition']); //대회 검색
    Route::get('/detail/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'showCompetition']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('', [App\Http\Controllers\api\competition\CompetitionController::class, 'storeCompetition']);
        Route::post('/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'updateCompetition']);

        Route::post('/apply/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'applyCompetition']);
        Route::post('/start/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'startCompetition']);
    });
});

/*
|--------------------------------------------------------------------------
| MATCH
|--------------------------------------------------------------------------
*/
Route::prefix('/matches')->group(function () {
    Route::get('/{cid}', [App\Http\Controllers\api\match\MatchController::class, 'showMatch']);
    Route::get('/ranking/{cid}', [App\Http\Controllers\api\match\MatchController::class, 'showRanking']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/score/{mid}', [App\Http\Controllers\api\match\MatchController::class, 'storeMatch']);
        Route::get('/match-in/{mid}', [App\Http\Controllers\api\match\MatchController::class, 'signinMatch']);
        Route::get('/match-out/{mid}', [App\Http\Controllers\api\match\MatchController::class, 'signinMatch']);
    });
});

/*
|--------------------------------------------------------------------------
| BOARD
|--------------------------------------------------------------------------
*/
Route::prefix('/boards')->group(function () {
//    Route::post('', [App\Http\Controllers\api\board\BoardController::class, 'storeBoard']);
//    Route::get('', [App\Http\Controllers\api\board\BoardController::class, 'indexBoards']);
//    Route::get('/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'showBoard']);
//    Route::patch('/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'updateBoard']);

    Route::get('/board-gallery/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'indexGallery']);

    Route::get('/board-notice/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'indexNotice']);
    Route::get('/board-notice/{tid}/{sid}', [App\Http\Controllers\api\board\BoardController::class, 'showNotice']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/board-notice/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'storeNotice']);
        Route::post('/board-notice/{tid}/{sid}', [App\Http\Controllers\api\board\BoardController::class, 'updateNotice']);

        Route::post('/board-gallery/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'storeGallery']);
    });
});
