<?php

namespace App\Http\Controllers\api\team;

use Illuminate\Routing\Controller as BaseController;
use App\Services\api\team\TeamAuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class TeamAuthController extends BaseController
{

    public function __construct(Request $request, private TeamAuthService $teamAuthService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * @OA\Post (
     *     path="/api/teams/signup/{sid}",
     *     tags={"팀"},
     *     description="팀 가입",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="tid", type="string", description="팀sid", example="3"),
     *                 @OA\Property (property="uid", type="string", description="가입하려는 회원아이디 token보내면 됨", example="token"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function signupTeam(Request $request)
    {
        return $this->teamAuthService->signupTeam($request);
    }

    /**
     * @OA\Get (
     *     path="/api/teams/signup/{sid}",
     *     tags={"팀"},
     *     description="팀 가입 신청 리스트 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function waitupTeam(String $sid)
    {
        return $this->teamAuthService->waitupTeam($sid);
    }

    /**
     * @OA\Post (
     *     path="/api/teams/confirm",
     *     tags={"팀"},
     *     description="팀 가입 승인",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="tid", type="string", description="팀sid", example="4"),
     *                 @OA\Property (property="uid", type="string", description="가입하려는 회원sid", example="10"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function confirm(Request $request)
    {
        return $this->teamAuthService->confirm($request);
    }


}
