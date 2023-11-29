<?php

namespace App\Http\Controllers\api\team;

use App\Models\Team;
use Illuminate\Routing\Controller as BaseController;
use App\Services\api\team\TeamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class TeamController extends BaseController
{

    public function __construct(Request $request, private TeamService $teamService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * @OA\Post (
     *     path="/api/teams",
     *     tags={"팀"},
     *     description="팀 생성",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="title", type="string", description="팀이름", example="갓챠"),
     *                 @OA\Property (property="contents", type="string", description="팀소개", example="내용"),
     *                 @OA\Property (property="region", type="string", description="지역", example="강남구"),
     *                 @OA\Property (property="limit_person", type="string", description="정원", example="1234"),
     *                 @OA\Property (property="sex", type="string", description="성별", example="혼성:0, 남자:1, 여자:2"),
     *                 @OA\Property (property="min_age", type="string", description="최소나이", example="20"),
     *                 @OA\Property (property="max_age", type="string", description="최대나이", example="40"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeTeam(Request $request)
    {
        return $this->teamService->storeTeam($request);
    }

    /**
     * @OA\Get (
     *     path="/api/teams",
     *     tags={"팀"},
     *     description="팀 리스트 불러오기 (del_yn='n') ",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function indexTeams()
    {
        return $this->teamService->indexTeams();
    }

    /**
     * @OA\Post (
     *     path="/api/teams/searchTeams",
     *     tags={"팀"},
     *     description="팀 검색 (del_yn='n')",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="title", type="string", description="팀이름", example="갓챠"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function searchTeams(Request $request)
    {
        return $this->teamService->searchTeams($request);
    }

    /**
     * @OA\Get (
     *     path="/api/teams/{$sid}",
     *     tags={"팀"},
     *     description="팀 상세 불러오기 (del_yn='n') ",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showTeam(String $sid)
    {
        return $this->teamService->showTeam($sid);
    }

}
