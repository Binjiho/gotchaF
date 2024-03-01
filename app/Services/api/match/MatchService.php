<?php

namespace App\Services\api\match;

use App\Models\Competition;
use App\Models\Competition_Team;
use App\Models\Matches;
use App\Models\Match_Users;

use App\Models\Team_User;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Class AuthServices
 * @package App\Services
 */
class MatchService extends Services
{
    public $data = array();

    public function showMatch(String $cid)
    {
        try {
            $matches = DB::table('matches')
                ->join('teams as t1', function ($join) {
                    $join->on('t1.sid', '=', 'matches.tid1');
                })
                ->join('teams as t2', function ($join) {
                    $join->on('t2.sid', '=', 'matches.tid2');
                })
                ->select('matches.sid','matches.round','matches.order','matches.matched_at','t1.title as title1', 't1_score', 't1.file_path as thum1', 't2.title as title2', 't2_score', 't2.file_path as thum2')
                ->where('matches.cid', '=', $cid)
                ->where('matches.del_yn', '=', 'N')
                ->orderBy('matches.round')
                ->orderBy('matches.order')
                ->get();
            if(!$matches){
                return response()->json([
                    'message' => '경기 대진표 정보가 없습니다.',
                    'state' => "E",
                ], 500);
            }

            $data = [
                "result" => $matches,
            ];

            return response()->json([
                'message' => 'Successfully loaded Matches!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded Matches!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }
    public function storeMatch(String $mid, Request $request)
    {
        $user = auth()->user();
        $user_level = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
        ])->first();

        if($user_level->level != 'L'){
            return response()->json([
                'message' => '팀의 리더만 경기를 수정할 수 있습니다.',
                'state' => "E",
            ], 500);
        }

        $match = Matches::where( ['del_yn' => 'N', 'sid' => $mid ])->first();
        if(!$match){
            return response()->json([
                'message' => '경기 대진표 정보가 없습니다.',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            if($request->t1_score) $match->t1_score = $request->t1_score;
            if($request->t2_score) $match->t2_score = $request->t2_score;
            if($request->matched_at) $match->matched_at = $request->matched_at;
            if($request->state) $match->state = $request->state;
            $match->save();

            $now = date('Y-m-d H:i:s');

            if($request->state == 'Y'){

                if($match->type == '1'/*리그*/) {
                    /**
                     * 승리 : +3
                     * 무승부 : +1
                     * 패배 : 0
                     */
                    if($request->t1_score > $request->t2_score){
                        $comp_team1 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid1,
                        ])->first();
                        $comp_team1->tot_score += 3;
                        $comp_team1->step += 1;
                        $comp_team1->w_cnt += 1;
                        $comp_team1->save();

                        $comp_team2 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid2,
                        ])->first();
                        $comp_team2->step += 1;
                        $comp_team2->l_cnt += 1;
                        $comp_team2->save();

                    }else if($request->t1_score < $request->t2_score){
                        $comp_team1 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid1,
                        ])->first();
                        $comp_team1->step += 1;
                        $comp_team1->l_cnt += 1;
                        $comp_team1->save();

                        $comp_team2 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid2,
                        ])->first();
                        $comp_team2->tot_score += 3;
                        $comp_team2->step += 1;
                        $comp_team2->w_cnt += 1;
                        $comp_team2->save();
                    }else{
                        $comp_team1 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid1,
                        ])->first();
                        $comp_team1->tot_score += 1;
                        $comp_team1->step += 1;
                        $comp_team1->d_cnt += 1;
                        $comp_team1->save();

                        $comp_team2 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid2,
                        ])->first();
                        $comp_team2->tot_score += 1;
                        $comp_team2->step += 1;
                        $comp_team2->d_cnt += 1;
                        $comp_team2->save();
                    }

                    //리그의 모든 경기가 마감되면 competition 완료(C) 업데이트
                    $match_scnt = Matches::where( ['del_yn' => 'N', 'cid' => $match->cid, 'state' => 'S' ])->count();
                    if($match_scnt == $match->total_step){
                        $comp = Competition::where( [
                            'del_yn' => 'N',
                            'sid' => $match->cid,
                        ])->first();
                        $comp->state = 'C'; //완료
                        $comp->save();
                    }

                }else if ($match->type == '2'/*컵*/) {
                    //승리한 tid
                    $next_tid = 0;
                    //무승부는 불가능함
                    if($request->t1_score > $request->t2_score){
                        $comp_team1 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid1,
                        ])->first();

                        $comp_team1->tot_score += 3;
                        $comp_team1->step += 1;
                        $comp_team1->w_cnt += 1;
                        $comp_team1->state = 'W';
                        $comp_team1->save();

                        $comp_team2 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid2,
                        ])->first();
                        $comp_team2->step += 1;
                        $comp_team2->l_cnt += 1;
                        $comp_team2->state = 'L';
                        $comp_team2->save();

                        $next_tid = $match->tid1;
                    }else if($request->t1_score < $request->t2_score){
                        $comp_team1 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid1,
                        ])->first();
                        $comp_team1->step += 1;
                        $comp_team1->l_cnt += 1;
                        $comp_team1->state = 'L';
                        $comp_team1->save();

                        $comp_team2 = Competition_Team::where( [
                            'del_yn' => 'N',
                            'cid' => $match->cid,
                            'tid' => $match->tid2,
                        ])->first();
                        $comp_team2->tot_score += 3;
                        $comp_team2->step += 1;
                        $comp_team2->w_cnt += 1;
                        $comp_team2->state = 'W';
                        $comp_team2->save();

                        $next_tid = $match->tid2;
                    }
                    //현재 라운드 구하기
                    $this_round = $match->round;
                    //다음 라운드
                    $next_round = $this_round+1;
                    //순서를 나누기 2해서 1이면 다음 라운드 1번째 경기, 2면 다음 라운드 2번째 경기
                    $next_order = ceil($match->order / 2);

                    $matches = Matches::where( [
                        'del_yn' => 'N',
                        'state' => 'N',
                        'cid' => $match->cid,
                        'round' => $next_round,
                        'order' => $next_order,
                    ])->first();

                    if($matches){
                        $matches->tid2 = $next_tid;
                        $matches->save();
                    }else{
                        $matches = new Matches();
                        $matches->cid = $match->cid;
                        $matches->type = $match->type;
                        $matches->tid1 = $next_tid;
                        $matches->tid2 = 0;
                        $matches->total_step = $match->total_step;
                        $matches->round = $next_round;
                        $matches->order = $next_order;
                        $matches->created_at = $now;
                        $matches->save();
                    }

                    //컵의 모든 경기가 마감되면 competition 완료(C) 업데이트
                    if($this_round == $match->total_step && $match->state == 'S'){
                        $comp = Competition::where( [
                            'del_yn' => 'N',
                            'sid' => $match->cid,
                        ])->first();
                        $comp->state = 'C'; //완료
                        $comp->save();
                    }
                }
            }

            $data = [
                "result" => $match,
            ];

            $this->dbCommit('매치 대진표 수정');

            return response()->json([
                'message' => 'Successfully store Match!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error store Match!',$e);
        }
    }


    public function showRanking(String $cid)
    {
        $comp = Competition::where( [
            'del_yn' => 'N',
            'sid' => $cid,
        ])->first();
        if(!$comp){
            return response()->json([
                'message' => '해당 경기를 찾을 수 없습니다.',
                'state' => "E",
            ], 500);
        }

        try {
            if($comp->type=='1'/*리그*/){

                $matches = DB::table('competition_teams as cp')
                    ->join('teams', function ($join) {
                        $join->on('teams.sid', '=', 'cp.tid');
                    })
                    ->select('teams.title', 'teams.file_path as thum','cp.tid','cp.step','cp.tot_score','cp.w_cnt','cp.d_cnt','cp.l_cnt')
                    ->where('cp.cid', '=', $cid)
                    ->where('cp.del_yn', '=', 'N')
                    ->orderBy('cp.tot_score','desc')
                    ->orderBy('cp.step','desc')
                    ->get();

            }else if($comp->type =='2'/*컵*/){
                $matches = DB::table('matches')
                    ->leftJoin('teams as t1', function ($join) {
                        $join->on('t1.sid', '=', 'matches.tid1');
                    })
                    ->leftJoin('teams as t2', function ($join) {
                        $join->on('t2.sid', '=', 'matches.tid2');
                    })
                    ->select('t1.title as title1', 't1.file_path as thum1', 't2.title as title2', 't2.file_path as thum2','matches.sid','matches.round','matches.order','matches.state','matches.t1_score','matches.t2_score','matches.matched_at')
                    ->where('matches.cid', '=', $cid)
                    ->where('matches.del_yn', '=', 'N')
                    ->orderBy('matches.round')
                    ->orderBy('matches.order')
                    ->get();
            }

            $data = [
                "result" => $matches,
            ];

            return response()->json([
                'message' => 'Successfully loaded Ranking!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded Ranking!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }

    }

    public function signinMatch(String $mid)
    {
        $match = Matches::where( [
            'del_yn' => 'N',
            'sid' => $mid,
        ])->first();
        if(!$match){
            return response()->json([
                'message' => '해당 경기를 찾을 수 없습니다.',
                'state' => "E",
            ], 500);
        }

        $user = auth()->user();
        $team_user_info = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
        ])->first();
        if(!$team_user_info){
            return response()->json([
                'message' => '팀 가입정보를 찾을 수 없습니다.',
                'state' => "E",
            ], 500);
        }
        if($team_user_info->tid != $match->tid1 && $team_user_info->tid != $match->tid2){
            return response()->json([
                'message' => '가입된 팀정보와 경기에 참여하는 팀정보가 일치하지 않습니다.',
                'state' => "E",
            ], 500);
        }

        $match_user = Match_Users::where( [
            'del_yn' => 'N',
            'mid' => $mid,
            'tid' => $team_user_info->tid,
            'uid' => $user->sid,
        ])->first();
        if($match_user){
            return response()->json([
                'message' => '이미 참여한 경기입니다.',
                'state' => "E",
            ], 500);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $this->transaction();

            $match_user = new Match_Users();
            $match_user->mid = $mid;
            $match_user->tid = $team_user_info->tid;
            $match_user->uid = $user->sid;

            $match_user->created_at = $now;
            $match_user->save();

            $this->dbCommit('팀회원의 경기 참여');

            $data = [
                "result" => $match_user,
            ];

            return response()->json([
                'message' => 'Successfully join matchIn!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error join matchIn!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }

    }

    public function signoutMatch(String $mid)
    {
        $match = Matches::where( [
            'del_yn' => 'N',
            'sid' => $mid,
        ])->first();
        if(!$match){
            return response()->json([
                'message' => '해당 경기를 찾을 수 없습니다.',
                'state' => "E",
            ], 500);
        }

        $user = auth()->user();
        $team_user_info = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
        ])->first();
        if(!$team_user_info){
            return response()->json([
                'message' => '팀 가입정보를 찾을 수 없습니다.',
                'state' => "E",
            ], 500);
        }
        if($team_user_info->tid != $match->tid1 && $team_user_info->tid != $match->tid2){
            return response()->json([
                'message' => '가입된 팀정보와 경기에 참여하는 팀정보가 일치하지 않습니다.',
                'state' => "E",
            ], 500);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $this->transaction();

            $match_user = Match_Users::where( [
                'del_yn' => 'N',
                'mid' => $mid,
                'tid' => $team_user_info->tid,
                'uid' => $user->sid,
            ])->first();

            $match_user->del_yn = 'Y';
            $match_user->updated_at = $now;
            $match_user->save();

            $this->dbCommit('팀회원의 경기 참여 취소');

            $data = [
                "result" => $match_user,
            ];

            return response()->json([
                'message' => 'Successfully cancle matchIn!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error cancle matchIn!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }

    }

}
