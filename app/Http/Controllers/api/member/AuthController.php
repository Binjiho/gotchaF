<?php

namespace App\Http\Controllers\api\member;

use Illuminate\Routing\Controller as BaseController;
use App\Services\api\member\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
     * Login user and create token
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [boolean] remember_me
     * @return [string] access_token
     * @return [string] token_type
     * @return [string] expires_at
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);
        return $this->createToken($request->user_id, $request->password);

    }

    public function createToken ($userId, $password) {
        $credentials = array(
            'email' => $userId,
            'password' => $password
        );

        if (!Auth::attempt($credentials)) {
            return 'login fail';
        }

        $data = [
            'grant_type' => 'password',
            'client_id' => '2',
            'client_secret' => 'M4t3qokY6IcAiMdHFqq5gxGeuklxHgPYvX8KF78Y',
            'username' => Auth::user()['id'],
            'password' => $password,
            'scope' => '*',
        ];
        $request = Request::create('/oauth/token', 'POST', $data);
        $response = app()->handle($request);

        return $response;
    }

    /**
     * Logout user (Revoke the token)
     *
     * @return [string] message
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get the authenticated User
     *
     * @return [json] user object
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
