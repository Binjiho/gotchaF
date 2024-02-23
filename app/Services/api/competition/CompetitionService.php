<?php

namespace App\Services\api\competition;

use App\Models\Competition;

use App\Models\Competition_Team;
use App\Models\Matches;
use App\Models\Team_User;
use App\Models\User;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Class AuthServices
 * @package App\Services
 */
class CompetitionService extends Services
{
    public $data = array();
    public function storeCompetition(Request $request)
    {
        $user = auth()->user();
        $user_level = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
            'tid' => $request->tid,
        ])->first();

        if($user_level->level != 'L'){
            return response()->json([
                'message' => '팀의 리더만 경기를 만들 수 있습니다.',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            $comp = new Competition();
            $comp->tid = $request->tid;
            $comp->uid = $user->sid;
            $comp->kind = $request->kind;
            $comp->type = $request->type;
            $comp->state = 'W';
            $comp->title = $request->title;
            $comp->contents = $request->contents;
            $comp->region = $request->region;
            $comp->limit_team = $request->limit_team;
            $comp->person_vs = $request->person_vs;
            $comp->regist_edate = $request->regist_edate;
            $comp->event_sdate = $request->event_sdate;
            $comp->event_edate = $request->event_edate;
            $comp->frequency = $request->frequency;
            $comp->yoil = $request->yoil;
            $comp->created_at = $now;
            $comp->save();
            $save_id = $comp->sid;

            if($request->hasFile('files')){
                $s3_path = "gotcha/competitions/".$save_id;
                foreach($request->file('files') as $file){
                    $extension = $file->getClientOriginalExtension();
                    $uuid = uniqid();
                    $filename = $uuid. '_' . time() . '.' . $extension;
                    $filepath = $s3_path . '/' . $filename;

                    // S3에 파일 저장
                    Storage::disk('s3')->put($filepath, $file);

                    $comp = Competition::find($save_id);
                    $comp->file_originalname = $file->getClientOriginalName();
                    $comp->file_realname = $filename;
                    $comp->file_path = Storage::disk('s3')->url($filepath);
                    $comp->save();
                }
            }

            /**
             * 경기 생성 시, competition_teams 테이블에도 db저장
             * 경기 주최자 무조건 L(리더)
             */
            $comp_team = new Competition_Team();

            $comp_team->cid = $save_id;
            $comp_team->tid = $request->tid;
            $comp_team->level = 'L';
            $comp_team->created_at = $now;
            $comp_team->save();

            $data = [
                "result" => $comp,
            ];

            $this->dbCommit('경기 생성');

            return response()->json([
                'message' => 'Successfully created Competition!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error create Competition!',$e);
        }
    }


    public function indexCompetition(Request $request)
    {
        //type=>1:리그,2:컵
        if(!$request->type){
            $type = 1;
        }else{
            $type = $request->type;
        }
        try {
            $query = DB::table('competitions')
                ->select(DB::raw("*, ( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day, ( CASE WHEN DATEDIFF( NOW(),event_edate ) >= 0 THEN 'Y' ELSE 'N' END ) AS end_yn
                , ( CASE
                    WHEN regist_edate >= NOW() THEN '모집중'
                    WHEN event_edate < NOW() THEN '대회종료'
                    WHEN event_sdate < NOW() AND event_edate >= NOW() THEN '진행중'
                    ELSE '대회준비중' END ) AS state"))
                ->where('type', '=',$type)
                ->where('del_yn', '=','N');
            /**
             * 모집중:pre/진행중:ing/종료된:end
             */
            switch($request->sorting) {
                case 'pre':
                    $query->where('regist_edate', '>', now());
                    break;
                case 'ing':
                    $query->where('event_sdate', '<', now());
                    $query->where('event_edate', '>=', now());
                    break;
                case 'end':
                    $query->where('event_edate', '<', now());
                    break;
                default:
                    break;
            }

            /**
             * 최근등록순->종료 하위 순
             */
            $query->orderByRaw("FIELD(end_yn,'N','Y'), sid desc");

            $comps = $query->paginate(10);

            foreach($comps as $comp_idx => $comp) {
                $team_count = Competition_Team::where(['del_yn' => 'N', 'cid' => $comp->sid])->count();
                $comps[$comp_idx]->team_count = $team_count;
            }


            $data = [
                "result" => $comps,
            ];

            return response()->json([
                'message' => 'Successfully loaded Competitions!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded Competitions!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function searchCompetition(Request $request)
    {
        try {
            $query = DB::table('competitions')
                ->select(DB::raw("*, ( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day, ( CASE WHEN DATEDIFF( NOW(),event_edate ) >= 0 THEN 'Y' ELSE 'N' END ) AS end_yn
                , ( CASE
                    WHEN regist_edate >= NOW() THEN '모집중'
                    WHEN event_edate < NOW() THEN '대회종료'
                    WHEN event_sdate < NOW() AND event_edate >= NOW() THEN '진행중'
                    ELSE '대회준비중' END ) AS state"))
                ->where('title', 'like','%'.$request->search.'%')
                ->where('del_yn', '=','N');

            /**
             * 최근등록순->종료 하위 순
             */
            $query->orderByRaw("FIELD(end_yn,'N','Y'), sid desc");

            $comps = $query->paginate(10);

            foreach($comps as $comp_idx => $comp) {
                $team_count = Competition_Team::where(['del_yn' => 'N', 'cid' => $comp->sid])->count();
                $comps[$comp_idx]->team_count = $team_count;
            }

            $data = [
                "result" => $comps,
            ];

            return response()->json([
                'message' => 'Successfully searched Competitions!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error searched Competitions!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }
    public function showCompetition(String $cid)
    {
        try {
            $comp = Competition::where( ['del_yn' => 'N', 'sid' => $cid ])->first();
            if(!$comp){
                return response()->json([
                    'message' => 'There is No Competition!',
                    'state' => "E",
                ], 500);
            }

            $comp_dday = DB::table('competitions')
                ->select(DB::raw('( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day'))
                ->where('del_yn', '=','N')
                ->first();
            $comp['d_day'] = $comp_dday->d_day;

            $join_teams = DB::table('competition_teams')
                ->join('teams', 'competition_teams.tid', '=', 'teams.sid')
                ->select('competition_teams.tid', 'competition_teams.level', 'teams.title', 'teams.file_path as thum', 'teams.region')
                ->where('competition_teams.cid', '=', $cid)
                ->where('competition_teams.del_yn', '=', 'N')
                ->get();

            $comp['team_count'] = count($join_teams);
            $comp['join_teams'] = $join_teams;

            $data = [
                "result" => $comp,
            ];

            return response()->json([
                'message' => 'Successfully loaded Competition!',
                'state' => "S",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded Competition!',
                'state' => "E",
                'error' => $e,
            ], 500);
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
        if($comp->state == 'S'){
            return response()->json([
                'message' => '이미 경기가 생성 되었습니다!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $comp->state = 'S';
            $comp->save();

            /**
             * match 대진표 생성
             */
            //시작하는 팀
            $join_teams = Competition_Team::where( ['del_yn' => 'N', 'cid' => $comp->sid ])->get();
            $join_team_arr = array();
            foreach ($join_teams as $join_team) {
                $join_team_arr[] = $join_team['tid'];
            }
//            $join_teams = array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
//            $join_team_arr = array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
            //시작하는 팀 카운트
            $team_count = count($join_teams);
            //총 경기 수
            $total_step = ($team_count-1);
            //처음 만들어하야 하는 배열
            $match_team_arr = array();

            $now = date('Y-m-d H:i:s');

            if($comp->type == '1'/*리그*/){
                //한팀당 진행해야하는 라운드
                $round = ($team_count*($team_count-1)/2);

                //랜덤 배열 생성
                $tmp_team_arr = array();
                do {
                    $stick_arr = $join_team_arr;
                    $select_tkey1 = array_rand($stick_arr);
                    $stick_arr = array_diff($stick_arr, array($stick_arr[$select_tkey1]));
                    $select_tkey2 = array_rand($stick_arr);

                    $selected_arr = array($join_team_arr[$select_tkey1],$join_team_arr[$select_tkey2]);

                    $search_count = 0;
                    foreach($tmp_team_arr as $match_team){
                        $same_array=array_intersect($selected_arr,$match_team);
                        if(count($same_array) >= 2){
                            $search_count++;
                        }
                    }
                    if($search_count < 1){
                        $tmp_team_arr[] = $selected_arr;
                    }

                }while(count($tmp_team_arr) < $round);


                //라운드 갯수에 맞게 재정렬
                $round_count = 0;
                //생성된 매치 팀
                $tmp_match_team_arr = $tmp_team_arr;
                //조인 팀
                $tmp_join_team_arr = $join_team_arr;

                do{
                    foreach($tmp_match_team_arr as $tmp_key => $tmp_team){
                        $same_array=array_intersect($tmp_join_team_arr,$tmp_team);
                        if(count($same_array) >= 2){
                            $match_team_arr[$round_count][] = $tmp_team;
                            //매치 팀 배열에서 계속 값 제거
                            unset($tmp_match_team_arr[$tmp_key]);

                            //조인 팀 배열에서 계속 값 제거
                            $tmp_join_team_arr = array_diff($tmp_join_team_arr, $tmp_team);
                            break;
                        }
                    }

                    if(count($tmp_join_team_arr)==0){
                        $round_count++;
                        $tmp_join_team_arr = $join_team_arr;
                    }
                }while($round_count < $total_step);

                foreach ($match_team_arr as $match_idx => $match_val){
                    foreach($match_val as $idx => $val){
                        $matches = new Matches();
                        $matches->cid = $cid;
                        $matches->type = $comp->type;
                        $matches->tid1 = $val[0];
                        $matches->tid2 = $val[1];
                        $matches->total_step = $round;
                        $matches->round = $match_idx+1;
                        $matches->order = $idx+1;
                        $matches->created_at = $now;
                        $matches->save();
                    }
                }

            }else if($comp->type == '2'/*컵*/){

                //한팀당 진행해야하는 라운드
                $round = ($team_count/2);
                //조인 팀
                $tmp_join_team_arr = $join_team_arr;

                for($cup=0; $cup<$round; $cup++){
                    $select_tkey1 = array_rand($tmp_join_team_arr);
                    $tmp_join_team_arr = array_diff($tmp_join_team_arr, array($tmp_join_team_arr[$select_tkey1]));
                    $select_tkey2 = array_rand($tmp_join_team_arr);
                    $tmp_join_team_arr = array_diff($tmp_join_team_arr, array($tmp_join_team_arr[$select_tkey2]));
                    $selected_arr = array($join_team_arr[$select_tkey1],$join_team_arr[$select_tkey2]);

                    $match_team_arr[] = $selected_arr;
                }

                foreach ($match_team_arr as $match_idx => $match){
                    $matches = new Matches();
                    $matches->cid = $cid;
                    $matches->type = $comp->type;
                    $matches->tid1 = $match[0];
                    $matches->tid2 = $match[1];
                    $matches->total_step = (int)log($team_count,2);
                    $matches->round = 1;
                    $matches->order = $match_idx+1;
                    $matches->created_at = $now;
                    $matches->save();
                }

                /*
                //컵 경기의 경우, 총 시합 갯수만큼 빈배열 생성
                $add_team_count = $total_step-count($match_team_arr);

                if($add_team_count > 0){
                    for($i=1; $i<=$add_team_count; $i++){
                        $matches = new Matches();
                        $matches->cid = $cid;
                        $matches->type = $comp->type;
                        $matches->tid1 = 0;
                        $matches->tid2 = 0;
                        $matches->total_step = $total_step;
                        $matches->round = $i+1;
                        $matches->order = $i+count($match_team_arr);
                        $matches->created_at = $now;
                        $matches->save();
                    }
                }
                */

            }

            $data = [
                "result" => $match_team_arr,
            ];

            $this->dbCommit('경기 시작');

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
