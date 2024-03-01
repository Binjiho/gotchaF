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
     *     path="/api/teams/store",
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
     *                 @OA\Property (property="min_age", type="string", description="최소나이", example="2000"),
     *                 @OA\Property (property="max_age", type="string", description="최대나이", example="1993"),
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
     * @OA\Post  (
     *     path="/api/teams/update/{tid}",
     *     tags={"팀"},
     *     description="팀 수정",
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
     *                 @OA\Property (property="min_age", type="string", description="최소나이", example="2000"),
     *                 @OA\Property (property="max_age", type="string", description="최대나이", example="1990"),
     *                 @OA\Property (property="confirm_m", type="string", description="운영진 승인(Y/N)", example="Y"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function updateTeam(Request $request,String $sid)
    {
//        dd( $request->file('files') );

        return $this->teamService->updateTeam($request,$sid);
    }

    /**
     * @OA\Get (
     *     path="/api/teams",
     *     tags={"팀"},
     *     description="팀 리스트 불러오기",
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
     *     description="팀 검색",
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
     *     path="/api/teams/{$tid}",
     *     tags={"팀"},
     *     description="팀 상세 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showTeam(String $tid)
    {
        return $this->teamService->showTeam($tid);
    }

    /**
     * @OA\Get (
     *     path="/api/teams/detail-match/{$tid}",
     *     tags={"팀"},
     *     description="팀 경기 상세 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showTeamMatch(String $sid)
    {
        return $this->teamService->showTeamMatch($sid);
    }

    /**
     * @OA\Post (
     *     path="/api/teams/delete-team/{tid}",
     *     tags={"팀"},
     *     description="팀 삭제",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function deleteTeam(String $tid)
    {
        return $this->teamService->deleteTeam($tid);
    }

}
