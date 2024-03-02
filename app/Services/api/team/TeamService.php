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
class TeamService extends Services
{
    public function storeTeam(Request $request)
    {
        $this->transaction();

        $user = $request->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $team = new Team;
            $team->title = $request->title;
            $team->contents = $request->contents;
            $team->region = $request->region;
            $team->limit_person = $request->limit_person;
            $team->sex = $request->sex;
            $team->min_age = $request->min_age;
            $team->max_age = $request->max_age;
            $team->created_at = $now;
            $team->save();
            $save_id = $team->sid;

            $team_user = new Team_User();
            $team_user->tid = $save_id;
            $team_user->uid = $user->sid;
            $team_user->level = 'L';
            $team_user->created_at = $now;
            $team_user->save();

            if($request->hasFile('files')){
                $s3_path = "gotcha/teams/".$save_id."/thum";

                foreach($request->file('files') as $file){
                    if ($file->isValid()) {
                        $extension = $file->getClientOriginalExtension();
                        $uuid = uniqid();
                        $filename = $uuid. '_' . time() . '.' . $extension;
                        $filepath = $s3_path . '/' . $filename;
                        // S3에 파일 저장
                        Storage::disk('s3')->put($filepath, file_get_contents($file));

                        $update_team = Team::find($save_id);
                        $update_team->file_originalname = $file->getClientOriginalName();
                        $update_team->file_realname = $filename;
                        $update_team->file_path = Storage::disk('s3')->url($filepath);
                        $update_team->save();
                    }
                }
            }

            $this->dbCommit('팀생성');

            return response()->json([
                'message' => 'Successfully created team!',
                'state' => "S",
                "data" => [ "team" => $update_team , "save_id"=>$save_id ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error created team!',$e);

        }
    }


    public function updateTeam(Request $request, String $sid)
    {
        $user = $request->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }
        $leader_user = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
            'tid' => $sid,
            'level' => 'L'
        ])->first();
        if(!$leader_user){
            return response()->json([
                'message' => 'Error load Leader User!',
                'state' => "E",
            ], 555);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            $team = Team::where( ['del_yn' => 'N', 'sid' => $sid ])->first();

            if($request->title) $team->title = $request->title;
            if($request->contents) $team->contents = $request->contents;
            if($request->region) $team->region = $request->region;
            if($request->limit_person) $team->limit_person = $request->limit_person;
            if($request->sex) $team->sex = $request->sex;
            if($request->min_age) $team->min_age = $request->min_age;
            if($request->max_age) $team->max_age = $request->max_age;

            $team->updated_at = $now;

            if($request->hasFile('files')){
                $s3_path = "gotcha/teams/".$sid."/thum";

                //기존 이미지 삭제
                if($team->file_path){
                    $file_uploaded_name = $team->file_realname;
                    $file_uploaded_path = $s3_path."/".$file_uploaded_name;
                    // Delete a file
                    Storage::disk('s3')->delete($file_uploaded_path);
                    // Delete multiple files
                    // Storage::disk('s3')->delete([$fileName1, $fileName2]);
                }

                //새로운 이미지 저장
                foreach($request->file('files') as $file){
                    if ($file->isValid()) {
                        $extension = $file->getClientOriginalExtension();
                        $uuid = uniqid();
                        $filename = $uuid. '_' . time() . '.' . $extension;
                        $filepath = $s3_path . '/' . $filename;

                        // S3에 파일 저장
                        Storage::disk('s3')->put($filepath, file_get_contents($file));
                        $team->file_originalname = $file->getClientOriginalName();
                        $team->file_realname = $filename;
                        $team->file_path = Storage::disk('s3')->url($filepath);
                    }
                }
            }

            $team->save();

            $this->dbCommit('팀수정');

            return response()->json([
                'message' => 'Successfully updated team!',
                'state' => "S",
                "data" => [ "team" => $team ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error updated team!',$e);

        }
    }


    public function indexTeams(Request $request)
    {
        try {
            if($request->per_page){
                $per_page = $request->per_page;
            }else{
                $per_page = 10;
            }

            $teams = Team::where( ['del_yn' => 'N' ])->simplePaginate($per_page);

            foreach($teams as $team_idx => $team){
                $team_count = Team_User::where( ['del_yn' => 'N', 'tid' => $team->sid ])->count();
                $teams[$team_idx]['user_count'] = $team_count;
            }
            return response()->json([
                'message' => 'Successfully loaded 팀리스트!',
                'state' => "S",
                "data" => ["teams" => $teams],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded 팀리스트!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function searchTeams(Request $request)
    {
        try {
            if($request->title){
                $teams = Team::where( [
                        'del_yn' => 'N',
                        'title' => $request->title,
                    ]
                )->get();
            }
            return response()->json([
                'message' => 'Successfully search teams!',
                'state' => "S",
                "data" => ["teams" => $teams],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error search teams!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function showTeam(String $tid)
    {
        $team_info = Team::where( [
            'del_yn' => 'N',
            'sid' => $tid,
        ])->get();
        if(!$team_info){
            return response()->json([
                'message' => '해당하는 팀정보가 없습니다!',
                'state' => "E",
                'error' => $tid,
            ], 500);
        }

        try {
            //팀 게시판
            $team_notices = DB::table('boards')
                ->Join('users','boards.uid','=','users.sid')
                ->select('users.name','users.file_path','boards.*')
                ->where('boards.ccode','=',1)
                ->where('boards.tid','=',$tid)
                ->get();

            //팀 경기일정
            $team_matches = DB::table('matches')
                ->join('teams as t1', function ($join) {
                    $join->on('t1.sid', '=', 'matches.tid1');
                })
                ->join('teams as t2', function ($join) {
                    $join->on('t2.sid', '=', 'matches.tid2');
                })
                ->leftJoin('competitions as c','c.sid','=','matches.cid')
                ->select(DB::raw('( CASE WHEN DATEDIFF( matches.matched_at,NOW() ) > 0 THEN DATEDIFF(matches.matched_at,NOW() ) ELSE 0 END ) as d_day, c.title, t1.title as title1, t2.title as title2, t1.file_path as t1_thum, t2.file_path as t2_thum, matches.sid,matches.round,matches.order, (SELECT count(match_users.sid) FROM match_users WHERE match_users.mid=matches.sid AND match_users.del_yn="N" AND match_users.tid='.$tid.') as match_user_cnt'))
                ->where('matches.del_yn', '=', 'N')
                ->where('matches.state', '=', 'N')
                ->where('matches.matched_at', '<>', null)
                ->where(function ($query) use ($tid) {
                    $query->where('matches.tid1', '=', $tid)
                        ->orWhere('matches.tid2', '=', $tid);
                })
                ->orderBy('matches.round')
                ->orderBy('matches.order')
                ->limit(4)
                ->get();

            //팀 유저
            $team_users = DB::table('users')
                ->join('team_users', function ($join) {
                    $join->on('users.sid', '=', 'team_users.uid')
                        ->where('team_users.level', '<>', 'W');
                })
                ->Join('teams','teams.sid','=','team_users.tid')
                ->select('users.*','team_users.level')
                ->where('teams.sid','=',$tid)
                ->get();

            return response()->json([
                'message' => 'Successfully loaded team!',
                'state' => "S",
                "data" => [
                    "team_info" => $team_info,
                    "team_matches" => $team_matches,
                    "team_users" => $team_users,
                    "team_notices" => $team_notices,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded team!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function showTeamMatch(String $tid)
    {
        $team_info = Team::where( [
            'del_yn' => 'N',
            'sid' => $tid,
        ])->get();
        if(!$team_info){
            return response()->json([
                'message' => '해당하는 팀정보가 없습니다!',
                'state' => "E",
                'error' => $tid,
            ], 500);
        }

        try {
            //팀 경기일정
            $team_matches = DB::table('matches')
                ->join('teams as t1', function ($join) {
                    $join->on('t1.sid', '=', 'matches.tid1');
                })
                ->join('teams as t2', function ($join) {
                    $join->on('t2.sid', '=', 'matches.tid2');
                })
                ->leftJoin('competitions as c','c.sid','=','matches.cid')
                ->select(DB::raw('( CASE WHEN DATEDIFF( matches.matched_at,NOW() ) > 0 THEN DATEDIFF(matches.matched_at,NOW() ) ELSE 0 END ) as d_day, c.title, t1.title as title1, t2.title as title2, t1.file_path as t1_thum, t2.file_path as t2_thum, matches.sid,matches.round,matches.order'))
                ->where('matches.del_yn', '=', 'N')
                ->where('matches.state', '=', 'N')
                ->where('matches.matched_at', '<>', null)
                ->where(function ($query) use ($tid) {
                    $query->where('matches.tid1', '=', $tid)
                        ->orWhere('matches.tid2', '=', $tid);
                })
                ->orderBy('matches.round')
                ->orderBy('matches.order')
                ->get();

            return response()->json([
                'message' => 'Successfully loaded team!',
                'state' => "S",
                "data" => [
                    "result" => $team_matches,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded team!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function deleteTeam(String $tid)
    {
        $user = auth()->user();
        $user_level = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
            'tid' => $tid,
        ])->first();
        if($user_level->level != 'L'){
            return response()->json([
                'message' => '팀의 리더만 팀을 삭제할 수 있습니다.',
                'state' => "E",
            ], 500);
        }

        $team_info = Team::where( [
            'del_yn' => 'N',
            'sid' => $tid,
        ])->first();
        if(!$team_info){
            return response()->json([
                'message' => '해당하는 팀정보가 없습니다!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            $team_info->del_yn = 'Y';
            $team_info->updated_at = $now;
            $team_info->save();

//            Team_User::where('team_users.tid', '=', $tid)->delete();
            $team_users = Team_User::where('team_users.tid', '=', $tid)->get();
            foreach ($team_users as $team_user){
                $team_user->del_yn = 'Y';
                $team_user->updated_at = $now;
                $team_user->save();
            }

            $this->dbCommit('팀삭제');

            return response()->json([
                'message' => 'Successfully deleted team!',
                'state' => "S",
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error deleted team!',$e);
        }
    }

}
