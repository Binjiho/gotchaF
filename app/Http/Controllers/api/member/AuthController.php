<?php

namespace App\Http\Controllers\api\member;

use App\Models\User;
use Illuminate\Routing\Controller as BaseController;
use App\Services\api\member\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends BaseController
{

    public function __construct(Request $request, private AuthService $authService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * @OA\Post (
     *     path="/api/auth/signup",
     *     tags={"회원가입"},
     *     description="일반 회원가입",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="email", type="string", description="email", example="jiho@naver.com"),
     *                 @OA\Property (property="password", type="string", description="password", example="1234"),
     *                 @OA\Property (property="name", type="string", description="이름", example="테스터"),
     *                  @OA\Property (property="position", type="string", description="선호 포지션 0:전체,1:공격수,2:중원,3:수비수,4:골키퍼", example="0"),
     *                  @OA\Property (property="sex", type="string", description="1:남성, 2:여성", example="1"),
     *                  @OA\Property (property="age", type="string", description="나이", example="1993"),
     *                  @OA\Property (property="social", type="string", description="social타입 null가능", example="google"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function signup(Request $request)
    {
        return $this->authService->signup($request);
    }

    /**
     * @OA\Post (
     *     path="/api/auth/signin",
     *     tags={"회원가입"},
     *     description="일반 회원 로그인",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="email", type="string", description="email", example="jiho@naver.com"),
     *                 @OA\Property (property="password", type="string", description="password", example="1234"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function signin(Request $request)
    {
        return $this->authService->signin($request);

    }

    /**
     * @OA\Get (
     *     path="/api/auth/logout",
     *     tags={"회원가입"},
     *     description="로그아웃",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="token"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function logout(Request $request)
    {
        return $this->authService->logout($request);
    }

    /**
     * @OA\Get (
     *     path="/api/auth/user",
     *     tags={"회원가입"},
     *     description="토큰으로 사용자 정보 얻기",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="token"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function user(Request $request)
    {
//        return response()->json($request->user());
        return $this->authService->user($request);
    }


    /**
     * @OA\Get (
     *     path="/api/auth/callback",
     *     tags={"회원가입"},
     *     description="sns 연동 url",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="provider"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function callback(String $provider)
    {
        return $this->authService->callback($provider);
    }

}
