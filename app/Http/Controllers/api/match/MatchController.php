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

    /**
     * @OA\Get (
     *     path="/api/matches/{$cid}",
     *     tags={"경기"},
     *     description="경기 대진표 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showMatch(String $cid)
    {
        return $this->matchService->showMatch($cid);
    }

    /**
     * @OA\Post (
     *     path="/api/matches/score/{$mid}",
     *     tags={"경기"},
     *     description="경기 스코어 및 경기날짜 저장",
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema (
     *                  @OA\Property (property="t1_score", type="int", description="1팀의 스코어", example="3"),
     *                  @OA\Property (property="t2_score", type="int", description="2팀의 스코어", example="1"),
     *                  @OA\Property (property="matched_at", type="timestamp", description="경기 진행 날짜", example="2024-02-13 18:30"),
     *                  @OA\Property (property="state", type="string", description="매치완료 토글버튼", example="Y"),
     *              )
     *          )
     *      ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeMatch(String $mid, Request $request)
    {
        return $this->matchService->storeMatch($mid, $request);
    }

    /**
     * @OA\Post (
     *     path="/api/matches/score-complete/{$mid}",
     *     tags={"경기"},
     *     description="경기 완료 저장",
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema (
     *                  @OA\Property (property="state", type="string", description="매치완료 토글버튼", example="Y"),
     *              )
     *          )
     *      ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function completeMatch(String $mid, Request $request)
    {
        return $this->matchService->completeMatch($mid, $request);
    }

    /**
     * @OA\Get (
     *     path="/api/matches/ranking/{$cid}",
     *     tags={"경기"},
     *     description="경기 랭킹표 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showRanking(String $cid)
    {
        return $this->matchService->showRanking($cid);
    }

    /**
     * @OA\Get (
     *     path="/api/matches/match-in/{$mid}",
     *     tags={"경기"},
     *     description="경기 참여하기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function signinMatch(String $mid)
    {
        return $this->matchService->signinMatch($mid);
    }

    /**
     * @OA\Get (
     *     path="/api/matches/match-out/{$mid}",
     *     tags={"경기"},
     *     description="경기 참여취소하기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function signoutMatch(String $mid)
    {
        return $this->matchService->signoutMatch($mid);
    }
}
