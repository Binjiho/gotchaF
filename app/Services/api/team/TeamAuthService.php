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
    public function signupTeam(String $tid)
    {
        $this->transaction();

        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 555);
        }

        $already_team_signup = Team_User::where( ['del_yn' => 'N', 'uid' => $user->sid ])->first();
        if($already_team_signup){
            return response()->json([
                'message' => '이미 팀에 가입되어있는 회원입니다.',
                'state' => "E",
            ], 555);
        }

        $team = Team::where( ['del_yn' => 'N', 'sid' => $tid ])->first();
        if(!$team){
            return response()->json([
                'message' => '팀을 찾을 수 없습니다!',
                'state' => "E",
            ], 555);
        }

        if($user->age/*1995*/ < $team->max_age/*1993*/ ) {
            return response()->json([
                'message' => '팀 최대나이 제한과 회원님의 나이가 다릅니다.',
                'state' => "E",
            ], 555);
        }

        if($user->age/*1995*/ > $team->min_age/*2000*/) {
            return response()->json([
                'message' => '팀 최소나이 제한과 회원님의 나이가 다릅니다.',
                'state' => "E",
            ], 555);
        }

        if($team->sex > 0){
            if($user->sex != $team->sex) {
                return response()->json([
                    'message' => '팀 성별 제한과 회원님의 성별이 다릅니다.',
                    'state' => "E",
                ], 555);
            }
        }

        $team_count = Team_User::where( ['del_yn' => 'N', 'sid' => $tid ])->count();
        if($team_count >= $team->limit_person) {
            return response()->json([
                'message' => '팀 인원이 가득찼습니다.',
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


    public function waitupTeam(Request $request, String $sid)
    {
        $user = $request->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 555);
        }

        $team = Team::where( ['del_yn' => 'N', 'sid' => $sid ])->first();
        if(!$team){
            return response()->json([
                'message' => 'Error load Team!',
                'state' => "E",
            ], 555);
        }

        $confirm_user = Team_User::where( ['del_yn' => 'N', 'uid' => $user->sid, 'tid' => $sid ])->first();
        if(!$confirm_user){
            return response()->json([
                'message' => '팀유저가 아닙니다!',
                'state' => "E",
            ], 555);
        }

        if($team->confirm_m == 'N'){
            if($confirm_user->level != 'L'){
                return response()->json([
                    'message' => 'Error confirm Level!',
                    'state' => "E",
                ], 555);
            }
        }else{
            if($confirm_user->level == 'C' || $confirm_user->level == 'W'){
                return response()->json([
                    'message' => 'Error confirm Level!',
                    'state' => "E",
                ], 555);
            }
        }

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
            $user = $request->user();
            if(!$user){
                return response()->json([
                    'message' => 'Error load User!',
                    'state' => "E",
                ], 555);
            }

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

    public function mendate(Request $request)
    {
        $this->transaction();

        try {
            $now = date('Y-m-d H:i:s');

            $user = $request->user();
            if(!$user){
                return response()->json([
                    'message' => 'Error load User!',
                    'state' => "E",
                ], 555);
            }

            $leader_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $user->sid,
                'tid' => $request->tid,
                'level' => 'L'
            ])->first();
            if(!$leader_user){
                return response()->json([
                    'message' => 'Error load Leader User!',
                    'state' => "E",
                ], 555);
            }
            $leader_user = $this->modify_level($request->tid, $user->sid, 'C');
//            $leader_user->level = 'C'; //일반회원
//            $leader_user->updated_at = $now;
//            $leader_user->save();

            $mendate_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $request->uid,
                'tid' => $request->tid
            ])->first();
            $mendate_user = $this->modify_level($request->tid, $request->uid, 'L');
//            $mendate_user->level = 'L'; //리더
//            $mendate_user->updated_at = $now;
//            $mendate_user->save();

            $this->dbCommit('리더 양도 완료');

            return response()->json([
                'message' => 'Successfully mendate!',
                'state' => "S",
                "data" => [ "mendate_user" => $mendate_user ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error mendate!',$e);

        }
    }


    public function manager(Request $request)
    {
        $this->transaction();

        try {
            $user = $request->user();
            if(!$user){
                return response()->json([
                    'message' => 'Error load User!',
                    'state' => "E",
                ], 555);
            }

            $leader_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $user->sid,
                'tid' => $request->tid,
                'level' => 'L'
            ])->first();
            if(!$leader_user){
                return response()->json([
                    'message' => 'Error load Leader User!',
                    'state' => "E",
                ], 555);
            }

            $target_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $request->uid,
                'tid' => $request->tid
            ])->first();
            if(!$target_user){
                return response()->json([
                    'message' => 'Error load Target User!',
                    'state' => "E",
                ], 555);
            }

            if($target_user->level == 'M'){
                $target_level = 'C';
            }else{
                $target_level = 'M';
            }

            $manager_user = $this->modify_level($request->tid, $request->uid, $target_level);

            $this->dbCommit('운영진 변경 완료');

            return response()->json([
                'message' => 'Successfully manager!',
                'state' => "S",
                "data" => [ "manager_user" => $manager_user ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error manager !',$e);

        }
    }


    public function deleteMember(Request $request)
    {
        $this->transaction();

        try {
            $now = date('Y-m-d H:i:s');

            $user = $request->user();
            if(!$user){
                return response()->json([
                    'message' => 'Error load User!',
                    'state' => "E",
                ], 555);
            }

            $leader_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $user->sid,
                'tid' => $request->tid,
                'level' => 'L'
            ])->first();
            if(!$leader_user){
                return response()->json([
                    'message' => 'Error load Leader User!',
                    'state' => "E",
                ], 555);
            }

            $target_delete_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $request->uid,
                'tid' => $request->tid
            ])->first();
            $target_delete_user->del_yn = 'Y'; //강제탈퇴
            $target_delete_user->updated_at = $now;
            $target_delete_user->save();

            $this->dbCommit('강제탈퇴 완료');

            return response()->json([
                'message' => 'Successfully target_delete!',
                'state' => "S",
                "data" => [ "target_delete_user" => $target_delte_user ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error target_delete!',$e);

        }
    }

    public function modify_level(String $tid, String $uid, String $level){
        $this->transaction();

        try {
            $now = date('Y-m-d H:i:s');

            $target_user = Team_User::where( [
                'del_yn' => 'N',
                'uid' => $uid,
                'tid' => $tid
            ])->first();

            $target_user->level = $level; //강제탈퇴
            $target_user->updated_at = $now;
            $target_user->save();

            $this->dbCommit('target modify level');

            return $target_user;
        } catch (\Exception $e) {

            return $this->dbRollback('Error target modify level!',$e);

        }
    }


}
