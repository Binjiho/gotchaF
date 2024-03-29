<?php

namespace App\Http\Controllers\api\competition;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\api\competition\CompetitionService;

class CompetitionController extends Controller
{
    public function __construct(Request $request, private CompetitionService $compService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * @OA\Post (
     *     path="/api/competitions",
     *     tags={"대회"},
     *     description="대회 생성(팀의 리더만 대회를 생성 할 수 있음)",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="tid", type="string", description="호스트 팀아이디", example="1"),
     *                  @OA\Property (property="kind", type="string", description="대회 종목(1:풋살, 2:축구)", example="1"),
     *                  @OA\Property (property="type", type="string", description="대회 타입(1:리그, 2:컵)", example="1"),
     *                 @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                 @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                 @OA\Property (property="region", type="string", description="지역", example="서울시 노원구"),
     *                 @OA\Property (property="limit_team ", type="string", description="팀제한수", example="6"),
     *                 @OA\Property (property="person_vs ", type="string", description="경기인원", example="5:5,11:11 형태로 구분"),
     *                 @OA\Property (property="regist_edate", type="string", description="모집마감일", example="2024-01-01 00:00:00"),
     *                 @OA\Property (property="event_sdate", type="string", description="경기(이벤트)시작일", example="2024-01-30 00:00:00"),
     *                 @OA\Property (property="event_edate", type="string", description="경기(이벤트)마감일", example="2024-02-28 00:00:00"),
     *                 @OA\Property (property="frequency", type="string", description="경기빈도", example="주1회, 주2회, 월5회,..."),
     *                 @OA\Property (property="yoil", type="string", description="경기선호요일", example="0,1,2 (0:일,1:월,2:화 콤마 형태로 구분)"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeCompetition(Request $request)
    {
        return $this->compService->storeCompetition($request);
    }

    /**
     * @OA\Get (
     *     path="/api/competitions?type=1&sorting",
     *     tags={"대회"},
     *     description="대회 리스트 불러오기 [type=>0:리그,1:컵] [sorting =>pre:진행전,ing:진행중,end:종료된] [per_page=>페이지 당 레코드 갯수] [page =>보여줄 페이지]",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function  indexCompetition(Request $request)
    {
        return $this->compService->indexCompetition($request);
    }
    /**
     * @OA\Post (
     *     path="/api/competitions/search",
     *     tags={"대회"},
     *     description="대회 리스트 불러오기 검색 ",
     *     @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema (
     *                  @OA\Property (property="search", type="string", description="대회 검색(경기 title)", example="짧은"),
     *              )
     *          )
     *      ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function searchCompetition(Request $request)
    {
        return $this->compService->searchCompetition($request);
    }

    /**
     * @OA\Get (
     *     path="/api/competitions/detail/{$cid}",
     *     tags={"대회"},
     *     description="대회 상세 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showCompetition(String $cid)
    {
        return $this->compService->showCompetition($cid);
    }

    /**
     * @OA\Patch  (
     *     path="/api/competitions/{$cid}",
     *     tags={"대회"},
     *     description="대회 삭제 (display_yn='n') ",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function deleteCompetition(String $cid)
    {
        return $this->compService->deleteCompetition($cid);
    }

    /**
     * @OA\Post (
     *     path="/api/competitions/{cid}",
     *     tags={"대회"},
     *     description="대회 수정",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="kind", type="string", description="대회 종목(1:풋살, 2:축구)", example="1"),
     *                 @OA\Property (property="type", type="string", description="대회 타입(1:리그, 2:컵)", example="1"),
     *                 @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                 @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                 @OA\Property (property="region", type="string", description="지역", example="서울시 노원구"),
     *                 @OA\Property (property="limit_team ", type="string", description="팀제한수", example="6"),
     *                 @OA\Property (property="person_vs ", type="string", description="경기인원", example="5:5,11:11 형태로 구분"),
     *                 @OA\Property (property="regist_edate", type="string", description="모집마감일", example="2024-01-01 00:00:00"),
     *                 @OA\Property (property="event_sdate", type="string", description="경기(이벤트)시작일", example="2024-01-30 00:00:00"),
     *                 @OA\Property (property="event_edate", type="string", description="경기(이벤트)마감일", example="2024-02-28 00:00:00"),
     *                 @OA\Property (property="frequency", type="string", description="경기빈도", example="주1회, 주2회, 월5회,..."),
     *                 @OA\Property (property="yoil", type="string", description="경기선호요일", example="0,1,2 (0:일,1:월,2:화 콤마 형태로 구분)"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function updateCompetition(String $cid, Request $request)
    {
        return $this->compService->updateCompetition($cid, $request);
    }

    /**
     * @OA\Post (
     *     path="/api/competitions/apply/{cid}",
     *     tags={"대회"},
     *     description="대회 참여 신청",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="cid", type="string", description="참여 경기의 sid", example="1"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function applyCompetition(String $cid)
    {
        return $this->compService->applyCompetition($cid);
    }

    /**
     * @OA\Post (
     *     path="/api/competitions/start/{cid}",
     *     tags={"대회"},
     *     description="대회 경기 시작, 대회 state값 변경 및 매치 생성",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="cid", type="string", description="참여 경기의 sid", example="1"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function startCompetition(String $cid)
    {
        return $this->compService->startCompetition($cid);
    }

}
