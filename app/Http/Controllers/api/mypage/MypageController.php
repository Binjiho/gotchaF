<?php

namespace App\Http\Controllers\api\mypage;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use App\Services\api\mypage\MypageService;

class MypageController extends BaseController
{

    public function __construct(Request $request, private MypageService $mypageService)
    {
//        view()->share('main_menu', 'M10');
    }

    /**
     * @OA\Get (
     *     path="/api/mypage",
     *     tags={"마이페이지"},
     *     description="토큰으로 사용자 팀 정보 얻기(팀sid,level)",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function indexMypage()
    {
        return $this->mypageService->indexMypage();
    }

    /**
     * @OA\Get (
     *     path="/api/mypage/detail",
     *     tags={"마이페이지"},
     *     description="토큰으로 사용자 디테일 정보 얻기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showMypage()
    {
        return $this->mypageService->showMypage();
    }

    /**
     * @OA\Get (
     *     path="/api/mypage/detail/match",
     *     tags={"마이페이지"},
     *     description="detail my Match 정보 얻기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showMymatch()
    {
        return $this->mypageService->showMymatch();
    }

    /**
     * @OA\Post  (
     *     path="/api/mypage",
     *     tags={"마이페이지"},
     *     description="유저 정보 수정",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                  @OA\Property (property="name", type="string", description="이름", example="테스터"),
     *                  @OA\Property (property="position", type="string", description="선호 포지션 0:전체,1:공격수,2:중원,3:수비수,4:골키퍼", example="0"),
     *                  @OA\Property (property="sex", type="string", description="1:남성, 2:여성", example="1"),
     *                  @OA\Property (property="age", type="string", description="나이", example="1993"),
     *                  @OA\Property (property="htel", type="string", description="휴대폰번호", example="010-1234-1234"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function updateUser(Request $request)
    {
        return $this->mypageService->updateUser($request);
    }

    /**
     * @OA\Post (
     *     path="/api/mypage/thum",
     *     tags={"마이페이지"},
     *     description="회원 프로필사진 업데이트",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="files[]", type="file", description="파일", example="볼리비아.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeThum(Request $request)
    {
        return $this->mypageService->storeThum($request);

    }

}
