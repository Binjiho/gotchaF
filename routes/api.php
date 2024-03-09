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
    Route::get('redirect/naver', function () {
        return Socialite::driver('naver')->stateless()->redirect();
    });
    Route::get('redirect/facebook', function () {
        return Socialite::driver('facebook')->stateless()->redirect();
    });

    Route::get('callback/{provider}',[App\Http\Controllers\api\member\AuthController::class, 'callback']);

//    Route::get('snsSignup/{provider?}', function ($email=null, $provider=null) {
//        return response()->json([
//            'message' => 'please sns Signup',
//            'state' => "S",
//            'data' => ["email" => $email, "provider" => $provider],
//        ], 200);
//    })->name('snsSignup');

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
        Route::get('/detail/match', [App\Http\Controllers\api\mypage\MypageController::class, 'showMymatch']);
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
    Route::get('{per_page?}{page?}', [App\Http\Controllers\api\team\TeamController::class, 'indexTeams']);
    Route::post('/searchTeams', [App\Http\Controllers\api\team\TeamController::class, 'searchTeams']);
    Route::get('/detail/{tid}', [App\Http\Controllers\api\team\TeamController::class, 'showTeam']);
    Route::get('/detail-match/{tid}{type?}', [App\Http\Controllers\api\team\TeamController::class, 'showTeamMatch']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [App\Http\Controllers\api\team\TeamController::class, 'storeTeam']);
        Route::post('/update/{tid}', [App\Http\Controllers\api\team\TeamController::class, 'updateTeam']);
        Route::post('/signup/{tid}', [App\Http\Controllers\api\team\TeamAuthController::class, 'signupTeam']);
        Route::post('/waitup/{sid}', [App\Http\Controllers\api\team\TeamAuthController::class, 'waitupTeam']);
        Route::post('/confirm', [App\Http\Controllers\api\team\TeamAuthController::class, 'confirm']);
        Route::post('/mendate', [App\Http\Controllers\api\team\TeamAuthController::class, 'mendate']);
        Route::post('/delete-team/{tid}', [App\Http\Controllers\api\team\TeamController::class, 'deleteTeam']);
        Route::post('/manager-member', [App\Http\Controllers\api\team\TeamAuthController::class, 'manager']);
        //팀게시판
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
    Route::get('{type?}{sorting?}{per_page?}{page?}', [App\Http\Controllers\api\competition\CompetitionController::class, 'indexCompetition']); //전체
    Route::post('/search', [App\Http\Controllers\api\competition\CompetitionController::class, 'searchCompetition']); //대회 검색
    Route::get('/detail/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'showCompetition']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('', [App\Http\Controllers\api\competition\CompetitionController::class, 'storeCompetition']);
        Route::post('/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'updateCompetition']);

        Route::post('/apply/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'applyCompetition']);
        Route::post('/start/{cid}', [App\Http\Controllers\api\competition\CompetitionController::class, 'startCompetition']);

        //경기 공지사항/문의
        Route::post('/board-notice', [App\Http\Controllers\api\team\TeamController::class, 'notice']);
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
Route::controller(\App\Http\Controllers\api\board\BoardController::class)->prefix('/boards')->group(function () {
    Route::get('/board-gallery/{tid}', 'indexGallery');

    Route::get('/board-notice/{tid}{per_page?}{page?}','indexNotice');
    Route::get('/board-notice/{tid}/{sid}', 'showNotice');

    Route::get('/board-inquire/{cid}', 'indexInquire');
    Route::get('/board-inquire/{cid}/{sid}', 'showInquire');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/board-notice/{tid}', 'storeNotice');
        Route::post('/board-notice/{tid}/{sid}', 'updateNotice');

        Route::post('/board-inquire/{cid}', 'storeInquire');
        Route::post('/board-inquire/{cid}/{sid}', 'updateInquire');
        Route::post('/board-reply/{sid}', 'replyInquire');

        Route::post('/board-gallery/{tid}', [App\Http\Controllers\api\board\BoardController::class, 'storeGallery']);
    });
});
