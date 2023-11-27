<?php

namespace App\Services\api\member;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

/**
 * Class AuthServices
 * @package App\Services
 */
class AuthService
{
    public function signup(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|max:255'
            ]);

            $now = date('Y-m-d H:i:s');

            $user = new User([
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'social'=> isset($request->social) ? $request->social : null,
                'created_at' => $now
            ]);

            $user->save();

            // 회원가입 메일 발송
//            $sendMail = (new MailServices())->mailSendService($user, '회원가입 메일입니다.', 'register', 0);
//            if($sendMail !== true) {
//                return $sendMail;
//            }

            return response()->json([
                'message' => 'Successfully created user!',
                'state' => "S",
            ], 200);
//            return $this->returnJsonData('submit', $this->ajaxActionSubmit('#register-frm', route('register', ['step' => 'step3'])));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error create user!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function signin(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string',
                'password' => 'required|string'
            ]);

            $data = [
                'email' => $request->email,
                'password' => $request->password
            ];
            if(auth()->attempt($data)) {
//                $token = auth()->user()->createToken('gotcha')->accessToken;
                $token = auth()->user()->createToken('gotcha')->plainTextToken;

                return response()->json([
                    'message' => 'Successfully login!',
                    'state' => "S",
                    'token' => $token
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'login failed! unauthorized!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Successfully logged out',
                'state' => "S",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'delete token failed!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function callback(String $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Find User By Email
            $user = User::where([
                'email'=> $socialUser->getEmail()
            ])->first();

            if($user){
                if(Auth::loginUsingId($user['id'])) {
                    $token = auth()->user()->createToken('gotcha')->plainTextToken;
                    return response()->json([
                        'message' => 'Successfully login!',
                        'state' => "S",
                        'token' => $token
                    ], 200);
                }
            }else{
                return redirect()->route('snsSignup',['provider'=>$provider]);

            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'callback failed!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    private function forgotPassowrdServices(Request $request)
    {
        $user = User::where(['uid' => $request->uid, 'name_kr' => $request->name_kr, 'email' => $request->email])->first();

        if(empty($user)) {
            $this->setJsonData('addCss', [
                $this->ajaxActionCss('.formArea:eq(1) .result', 'display', 'none'),
                $this->ajaxActionCss('.formArea:eq(1) .noResult', 'display', 'table-cell'),
            ]);

            return $this->returnJsonData('html', [
                $this->ajaxActionHtml('.formArea:eq(1) .noResult', '일치하는 정보가 없습니다.'),
            ]);
        }else {
            $this->transaction();

            try {
                $tempPassword = $this->tempPassword();

                $user->password = Hash::make($tempPassword);
                $user->password_at = date('Y-m-d H:i:s');
                $user->update();

                $user->tempPassword = $tempPassword;

                // 임시비밀번호 메일 발송
                $sendMail = (new MailServices())->mailSendService($user, '홈페이지 임시 비밀번호 안내', 'forgot-pw', 0);

                if($sendMail !== true) {
                    return $sendMail;
                }

                $this->dbCommit('임시비밀번호 변경');

                $this->setJsonData('input', [
                    $this->ajaxActionInput('#forgot-password-frm input[name=uid]', ''),
                    $this->ajaxActionInput('#forgot-password-frm input[name=name_kr]', ''),
                    $this->ajaxActionInput('#forgot-password-frm input[name=email]', ''),
                ]);

                $this->setJsonData('addCss', [
                    $this->ajaxActionCss('.formArea:eq(1) .noResult', 'display', 'none'),
                    $this->ajaxActionCss('.formArea:eq(1) .result', 'display', 'table-cell'),
                ]);

                return $this->returnJsonData('html', [
                    $this->ajaxActionHtml('.formArea:eq(1) .result', '가입한 이메일로 임시 비밀번호가 발급되었습니다.'),
                ]);
            } catch (\Exception $e) {
                return $this->dbRollback($e);
            }
        }
    }

    private function tempPassword()
    {
        $feed1 = "0123456789";
        $feed2 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $tempPassword = '';

        for ($i = 0; $i < 3; $i++) {
            $tempPassword .= substr($feed1, rand(0, strlen($feed1) - 1), 1);
        }

        for ($i = 0; $i < 3; $i++) {
            $tempPassword .= substr($feed2, rand(0, strlen($feed2) - 1), 1);
        }

        return str_shuffle($tempPassword);
    }

}
