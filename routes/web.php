<?php

use Illuminate\Support\Facades\Route;
use App\Models\Team;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//Route::get('/', function () {
//    return view('welcome');
//})->name('test');
Route::get('/', function () {
    $teams = Team::where( ['del_yn' => 'N' ])->get();
    return $teams;
});

Route::get('/hello', function () {
    return view('hello');
});

// 회원메뉴
Route::prefix('auth')->group(function () {
    Route::get('/login', function() {
        return view('auth/login');
    });

});
//Route::prefix('auth')->group(function () {
//    Route::controller(\App\Http\Controllers\Web\Auth\AuthController::class)->group(function () {
//        Route::middleware('guest:web')->match(['get', 'post'], '/register/{step}', 'register')->where('step', 'step1|step2|step3')->name('register');
//        Route::middleware('guest:web')->get('forgot', 'forgot')->name('forgot');
//        Route::get('privacy', 'privacy')->name('auth.privacy');
//        Route::get('email', 'email')->name('auth.email');
//        Route::post('data', 'data')->name('auth.data');
//    });
//});
