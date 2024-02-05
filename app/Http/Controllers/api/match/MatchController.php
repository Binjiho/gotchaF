<?php

namespace App\Http\Controllers\api\match;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\api\match\MatchService;

class MatchController extends Controller
{
    public function __construct(Request $request, private MatchService $matchService)
    {
//        view()->share('main_menu', 'M10');
    }



}
