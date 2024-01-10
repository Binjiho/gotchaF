<?php

namespace App\Http\Controllers\api\member;

use App\Services\api\member\MemberService;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class MemberController extends BaseController
{

    public function __construct(Request $request, private MemberService $memberService)
    {
//        view()->share('main_menu', 'M10');
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
        return $this->memberService->storeThum($request);

    }

}
