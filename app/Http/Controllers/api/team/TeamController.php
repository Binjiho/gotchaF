<?php

namespace App\Http\Controllers\api\team;

use App\Models\User;
use Illuminate\Routing\Controller as BaseController;
use App\Services\api\member\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class TeamController extends BaseController
{

    public function __construct(Request $request, private AuthService $authService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * @OA\Post (
     *     path="/api/team/make",
     *     tags={"팀"},
     *     description="팀 생성",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="region", type="string", description="지역", example="강남구"),
     *                 @OA\Property (property="limit", type="string", description="정원", example="1234"),
     *                 @OA\Property (property="sex", type="string", description="성별", example="male"),
     *                 @OA\Property (property="under_age", type="string", description="최소나이", example="20"),
     *                 @OA\Property (property="top_age", type="string", description="최대나이", example="40"),
     *                 @OA\Property (property="content", type="string", description="팀소개", example="내용"),
     *                 @OA\Property (property="image", type="file", description="이미지", example="file[]"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function make(Request $request)
    {
        return $this->authService->signup($request);
    }


}
