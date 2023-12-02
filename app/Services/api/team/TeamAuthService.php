<?php

namespace App\Services\api\team;

use App\Models\Team;
use App\Models\Team_User;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

/**
 * Class AuthServices
 * @package App\Services
 */
class TeamAuthService extends Services
{
    public function signupTeam(Request $request)
    {
        $this->transaction();

        $user = $request->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 555);
        }

        $team = Team::where( ['del_yn' => 'N', 'sid' => $request->sid ])->first();

        if(!$team){
            return response()->json([
                'message' => 'Error load Team!',
                'state' => "E",
            ], 555);
        }

        if($user->age > $team->max_age ) {
            return response()->json([
                'message' => 'max age!',
                'state' => "E",
            ], 555);
        }

        if($user->age < $team->min_age) {
            return response()->json([
                'message' => 'min age!',
                'state' => "E",
            ], 555);
        }

        if($team->sex > 0){
            if($user->sex != $team->sex) {
                return response()->json([
                    'message' => 'wrong sex!',
                    'state' => "E",
                ], 555);
            }
        }

        $team_count = Team_User::where( ['del_yn' => 'N' ])->count();
        if($team_count >= $team->limit_person) {
            return response()->json([
                'message' => 'limit_person!',
                'state' => "E",
            ], 555);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $team_user = new Team_User();
            $team_user->tid = $team->sid;
            $team_user->uid = $user->sid;
            $team_user->level = 'W'; //가입대기
            $team_user->created_at = $now;
            $team_user->save();

            $this->dbCommit('가입신청완료');

            return response()->json([
                'message' => 'Successfully created team!',
                'state' => "S",
                "data" => [ "team_user" => $team_user ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error created team!',$e);

        }
    }


    public function waitupTeam(String $sid)
    {
        try {
            $wait_users = DB::table('team_users')
                ->Join('users','users.sid','=','team_users.uid')
                ->select('users.*')
                ->where('tid','=',$sid)
                ->where('level','=','W')
                ->get();

            return response()->json([
                'message' => 'Successfully wait_users!',
                'state' => "S",
                "data" => ["wait_users" => $wait_users],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded wait_users!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function confirm(Request $request)
    {
        $this->transaction();

        try {
            $now = date('Y-m-d H:i:s');

            $wait_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $request->uid,
                'tid' => $request->tid
            ])->first();


            $wait_user->level = 'C'; //일반회원
            $wait_user->allowed_at = $now;
            $wait_user->save();

            $this->dbCommit('가입 신청 승인 완료');

            return response()->json([
                'message' => 'Successfully confirm!',
                'state' => "S",
                "data" => [ "wait_user" => $wait_user ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error confirm!',$e);

        }
    }

}