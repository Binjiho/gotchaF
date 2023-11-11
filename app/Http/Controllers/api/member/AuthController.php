<?php

namespace App\Http\Controllers\Api\member;

use Illuminate\Routing\Controller as BaseController;
use App\Services\Api\member\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends BaseController
{

    public function __construct(Request $request, private AuthService $authService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * Create user
     *
     * @param  [string] name
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @return [string] message
     */
    public function signup(Request $request)
    {
        return $this->authService->signup($request);
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
