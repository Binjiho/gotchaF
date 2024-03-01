<?php

namespace App\Services\api\mypage;

use App\Models\Competition;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Class AuthServices
 * @package App\Services
 */
class MypageService extends Services
{
    public function indexMypage()
    {
        try {
            $user = auth()->user();

            $team_users = DB::table('users')
                ->leftJoin('team_users','users.sid','=','team_users.uid')
                ->leftJoin('teams','teams.sid','=','team_users.tid')
                ->select('users.*','teams.sid','team_users.level')
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

    public function showMypage()
    {
        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        $myteam = DB::table('teams')
            ->join('team_users', function ($join) use ($user) {
                $join->on('teams.sid', '=', 'team_users.tid')
                    ->where('team_users.uid', '=', $user->sid);
            })
            ->select('teams.*')
            ->where('team_users.uid','=',$user->sid)
            ->first();

        try {
            //내 경기 일정
            $mymatch = array();
            if($myteam){
                $mymatch = DB::table('matches')
                    ->join('teams as t1', function ($join) {
                        $join->on('t1.sid', '=', 'matches.tid1');
                    })
                    ->join('teams as t2', function ($join) {
                        $join->on('t2.sid', '=', 'matches.tid2');
                    })
                    ->join('match_users', function ($join) use ($user) {
                        $join->on('match_users.mid', '=', 'matches.sid')
                            ->where('match_users.uid', '=', $user->sid);
                    })
                    ->leftJoin('competitions as c','c.sid','=','matches.cid')
                    ->select(DB::raw('( CASE WHEN DATEDIFF( matches.matched_at,NOW() ) > 0 THEN DATEDIFF(matches.matched_at,NOW() ) ELSE 0 END ) as d_day, c.title, t1.title as title1, t2.title as title2, t1.file_path as t1_thum, t2.file_path as t2_thum, matches.sid,matches.round,matches.order'))
                    ->where('matches.del_yn', '=', 'N')
                    ->where('matches.state', '=', 'N')
                    ->where('matches.matched_at', '<>', null)
                    ->orderBy('matches.created_at')
                    ->first();
            }

            /*내팀이 참여중인 경기*/
            $myteams = array();
            if($myteam){
                $myteams = DB::table('competitions')
                    ->join('competition_teams as ct', function ($join) use ($myteam) {
                        $join->on('competitions.sid', '=', 'ct.cid')
                            ->where('ct.tid', '=', $myteam->sid)
                            ->where('ct.del_yn', '=', 'N');
                    })
                    ->select(DB::raw('competitions.sid, competitions.type, competitions.title'))
                    ->where('competitions.del_yn', '=', 'N')
                    ->where('competitions.state', '=', 'S')
                    ->get();
            }

            /*내팀 경기의 기록*/
            $myteam_ranks = array();
            if($myteams){
                foreach($myteams as $mt){
                    $comp = DB::table('competition_teams as ct')
                        ->select(DB::raw('ct.tid, ct.state,  ct.w_cnt, ct.d_cnt, ct.l_cnt, ct.tot_score, ct.step, ROW_NUMBER() OVER (ORDER BY ct.tot_score DESC) AS `rank`'))
                        ->where('ct.cid', '=', $mt->sid)
                        ->get();
                    foreach($comp as $cp){
                        if($myteam->sid == $cp->tid){
                            $myteam_ranks[$mt->sid] = [
                                'sid' => $mt->sid,
                                'title' => $mt->title,
                                'type' => $mt->type,
                                'state' => $cp->state,
                                'w_cnt' => $cp->w_cnt,
                                'd_cnt' => $cp->d_cnt,
                                'l_cnt' => $cp->l_cnt,
                                'tot_score' => $cp->tot_score,
                                'step' => $cp->step,
                                'rank' => $cp->rank,
                            ];
                        }
                    }
                }
            }

            return response()->json([
                'message' => 'Successfully loaded 나의정보!',
                'state' => "S",
                "data" => [
                    "myinfo" => $user,
                    "mymatch" => $mymatch,
                    "myteam" => $myteam,
                    "myteams" => $myteams,
                    "myteam_ranks" => $myteam_ranks,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded 나의정보!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function showMymatch()
    {
        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        $myteam = DB::table('teams')
            ->join('team_users', function ($join) use ($user) {
                $join->on('teams.sid', '=', 'team_users.tid')
                    ->where('team_users.uid', '=', $user->sid);
            })
            ->select('teams.*')
            ->where('team_users.uid','=',$user->sid)
            ->first();

        try {
            //내 경기 일정
            $mymatch = DB::table('matches')
                ->join('teams as t1', function ($join) {
                    $join->on('t1.sid', '=', 'matches.tid1');
                })
                ->join('teams as t2', function ($join) {
                    $join->on('t2.sid', '=', 'matches.tid2');
                })
                ->join('match_users', function ($join) use ($user) {
                    $join->on('match_users.mid', '=', 'matches.sid')
                        ->where('match_users.uid', '=', $user->sid);
                })
                ->leftJoin('competitions as c','c.sid','=','matches.cid')
                ->select(DB::raw('( CASE WHEN DATEDIFF( matches.matched_at,NOW() ) > 0 THEN DATEDIFF(matches.matched_at,NOW() ) ELSE 0 END ) as d_day, c.title, t1.title as title1, t2.title as title2, t1.file_path as t1_thum, t2.file_path as t2_thum, matches.sid,matches.round,matches.order'))
                ->where('matches.del_yn', '=', 'N')
                ->where('matches.state', '=', 'N')
                ->where('matches.matched_at', '<>', null)
                ->orderBy('matches.created_at')
                ->get();

            return response()->json([
                'message' => 'Successfully loaded myMatch!',
                'state' => "S",
                "data" => [
                    "result" => $mymatch,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded myMatch!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function updateUser(Request $request)
    {
        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            if($request->name) $user->name = $request->name;
            if($request->position) $user->position = $request->position;
            if($request->sex) $user->sex = $request->sex;
            if($request->age) $user->age = $request->age;
            if($request->htel) $user->htel = $request->htel;

            $user->updated_at = $now;

            $user->save();

            $this->dbCommit('유저 수정');

            return response()->json([
                'message' => 'Successfully updated user!',
                'state' => "S",
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error updated user!', $e);
        }
    }

    public function storeThum(Request $request)
    {
        try {
            $user = $request->user();
            if(!$user){
                return response()->json([
                    'message' => 'Error load User!',
                    'state' => "E",
                ], 500);
            }

            $this->transaction();

            if($request->hasFile('files')){
                $s3_path = "gotcha/users/".$user['sid']."/thum";

                //기존 이미지 삭제
                if($user->file_path){
                    $file_uploaded_name = $user->file_realname;
                    $file_uploaded_path = $s3_path."/".$file_uploaded_name;
                    // Delete a file
                    Storage::disk('s3')->delete($file_uploaded_path);
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
                        $user->file_originalname = $file->getClientOriginalName();
                        $user->file_realname = $filename;
                        $user->file_path = Storage::disk('s3')->url($filepath);
                    }
                }
            }

            $user->save();

            $this->dbCommit('마이페이지 유저 썸네일 등록 및 수정');

            return response()->json([
                'message' => 'Successfully update user Thumbnail!',
                'state' => "S",
                "data" => ["user" => $user],
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error update user Thumbnail!',$e);
        }
    }

}
