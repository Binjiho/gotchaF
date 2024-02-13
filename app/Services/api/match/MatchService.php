<?php

namespace App\Services\api\match;

use App\Models\Matches;
use App\Models\Match_Scores;

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
                ->select('matches.round','matches.order','t1.title as title1','t2.title as title2 ')
                ->where('matches.cid', '=', $cid)
                ->where('matches.del_yn', '=', 'N')
                ->orderBy('matches.round')
                ->orderBy('matches. order')
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

            $now = date('Y-m-d H:i:s');

            if($request->t1_score) $match->t1_score = $request->t1_score;
            if($request->t2_score) $match->t2_score = $request->t2_score;
            if($request->matched_at) $match->matched_at = $request->matched_at;
            if($request->state) $match->state = $request->state;

            if($match->type == '1'/*리그*/) {

            }else if ($match->type == '2'/*컵*/) {
                $match->state = 'S';
                $match->save();
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


    public function updateCompetition(String $cid, Request $request)
    {
        $user = $request->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        $comp = Competition::where( ['del_yn' => 'N', 'sid' => $cid ])->first();
        if(!$comp){
            return response()->json([
                'message' => 'Error load Competition!',
                'state' => "E",
            ], 500);
        }

        if($user->sid !== $comp->uid){
            return response()->json([
                'message' => 'This User is not a Host User!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');
            if($request->kind) $comp->kind = $request->kind;
            if($request->type) $comp->type = $request->type;
            if($request->title) $comp->title = $request->title;
            if($request->contents) $comp->contents = $request->contents;
            if($request->region) $comp->region = $request->region;
            if($request->limit_team) $comp->limit_team = $request->limit_team;
            if($request->person_vs) $comp->person_vs = $request->person_vs;
            if($request->regist_edate) $comp->regist_edate = $request->regist_edate;
            if($request->event_sdate) $comp->event_sdate = $request->event_sdate;
            if($request->event_edate) $comp->event_edate = $request->event_edate;
            if($request->frequency) $comp->frequency = $request->frequency;
            if($request->yoil) $comp->yoil = $request->yoil;
            $comp->updated_at = $now;

            if($request->hasFile('files')){
                $s3_path = "gotcha/competitions/".$cid;

                //기존 이미지 삭제
                if($comp->file_path){
                    $file_uploaded_name = $comp->file_realname;
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
                        $comp->file_originalname = $file->getClientOriginalName();
                        $comp->file_realname = $filename;
                        $comp->file_path = Storage::disk('s3')->url($filepath);
                    }
                }
            }
            $comp->save();

            $data = [
                "result" => $comp,
            ];

            $this->dbCommit('대회 수정');

            return response()->json([
                'message' => 'Successfully update Competition!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error update Competition!',$e);
        }
    }

    public function applyCompetition(String $cid)
    {
        $user = auth()->user();
        $user_level = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
            'level' => 'L',
        ])->first();

        if(!$user_level){
            return response()->json([
                'message' => '팀의 리더가 아닙니다!',
                'state' => "E",
            ], 500);
        }

        $comp_registered = Competition_Team::where( [
            'del_yn' => 'N',
            'tid' => $user_level->tid,
            'cid' => $cid,
        ])->first();

        if($comp_registered){
            return response()->json([
                'message' => '이미 시합에 참여하였습니다!',
                'state' => "E",
            ], 500);
        }

        $comp = Competition::where( [
            'del_yn' => 'N',
            'sid' => $cid,
        ])->first()->limit_team;

        $comp_registered_cnt = Competition_Team::where( [
            'del_yn' => 'N',
            'cid' => $cid,
        ])->count();

        if($comp <= $comp_registered_cnt){
            return response()->json([
                'message' => '시합 모집 정원이 초과하였습니다!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            $comp_team = new Competition_Team();

            $comp_team->cid = $cid;
            $comp_team->tid = $user_level->tid;
            $comp_team->level = 'C';
            $comp_team->created_at = $now;
            $comp_team->save();

            $data = [
                "result" => $comp_team,
            ];

            $this->dbCommit('경기 참여');

            return response()->json([
                'message' => 'Successfully apply Competition!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error apply Competition!',$e);
        }
    }

    public function startCompetition(String $cid)
    {
        $user = auth()->user();
        $user_level = Competition_Team::where( [
            'del_yn' => 'N',
            'tid' => $user->sid,
            'level' => 'L',
        ])->first();

        if(!$user_level){
            return response()->json([
                'message' => '팀의 리더가 아닙니다!',
                'state' => "E",
            ], 500);
        }

        $comp = Competition::where( ['del_yn' => 'N', 'sid' => $cid ])->first();
        if(!$comp){
            return response()->json([
                'message' => 'There is No Competition!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $comp->state = 'S';
            $comp->save();

//            $now = date('Y-m-d H:i:s');

//            $comp = Competition::where( ['del_yn' => 'N', 'sid' => $cid ])->first();
//            if(!$comp){
//                return response()->json([
//                    'message' => 'There is No Competition!',
//                    'state' => "E",
//                ], 500);
//            }
//
//            $comp_team = new Competition_Team();
//            $comp_team->cid = $cid;
//            $comp_team->tid = $user_level->tid;
//            $comp_team->level = 'C';
//            $comp_team->created_at = $now;
//            $comp_team->save();

            $data = [
                "result" => $comp,
            ];

            $this->dbCommit('경기 참여');

            return response()->json([
                'message' => 'Successfully start Competition!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error start Competition!',$e);
        }
    }

}
