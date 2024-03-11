<?php

namespace App\Services\api\member;

use App\Models\Team_User;
use App\Models\User;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

/**
 * Class AuthServices
 * @package App\Services
 */
class AuthService extends Services
{
    public function signup(Request $request)
    {
        $this->transaction();

        try {
            $request->validate([
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|max:255'
            ]);

            $now = date('Y-m-d H:i:s');

            $user = new User([
                'email' => $request->email,
                'name' => $request->name,
                'password' => bcrypt($request->password),
                'position' => $request->position,
                'sex' => $request->sex,
                'age' => $request->age,
                'social'=> isset($request->social) ? $request->social : null,
                'created_at' => $now
            ]);

            $user->save();

            // 회원가입 메일 발송
//            $sendMail = (new MailServices())->mailSendService($user, '회원가입 메일입니다.', 'register', 0);
//            if($sendMail !== true) {
//                return $sendMail;
//            }

            $this->dbCommit('유저 생성');

            return response()->json([
                'message' => 'Successfully created user!',
                'state' => "S",
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error created user!', $e);
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
                    'data' => ["token"=>$token],
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

    //sns callback
    public function callback(String $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Find User By Email
            $user = User::where([
                'email'=> $socialUser->getEmail()
            ])->first();

            if($user){
                if(Auth::loginUsingId($user['sid'])) {
                    $token = auth()->user()->createToken('gotcha')->plainTextToken;
                    $cookie = Cookie::make('token', $token)->withHttpOnly(false);
                    return redirect("https://www.matchwt.com")->withCookie($cookie);
//                    return redirect("https://www.matchwt.com")->withHeaders(['Authorization' => 'Bearer ' . $token]);
//                    return response()->json([
//                        'message' => 'Successfully login!',
//                        'state' => "S",
//                        'token' => $token
//                    ], 200);
                }
            }else{
                $user = Socialite::driver($provider)->user();
                return redirect()->away("https://www.matchwt.com/auth/snsSignin?provider=".$provider."&email=".$user->getEmail());
//                return redirect()->route('snsSignup',['email'=>$user->getEmail() , 'provider'=>$provider]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'callback failed!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = auth()->user();

            $team_users = DB::table('users')
                ->leftJoin('team_users', function ($join) {
                    $join->on('users.sid', '=', 'team_users.uid')
                        ->where('team_users.del_yn', '=', 'N');
                })
                ->select('team_users.tid','team_users.level','users.*')
                ->where('users.sid','=',$user->sid)
                ->first();

            return response()->json([
                'message' => 'Successfully loaded myInfo!',
                'state' => "S",
                "data" => [
                    "result" => $team_users,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded myInfo!',
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
