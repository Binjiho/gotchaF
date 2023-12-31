<?php

namespace App\Services\api\competition;

use App\Models\Competition;

use App\Models\Competition_Team;
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
        $user = $request->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            $comp = new Competition();
            $comp->tid = $request->tid;
            $comp->uid = $request->uid;
            $comp->kind = $request->kind;
            $comp->type = $request->type;
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
                    $comp->file_name = $file->getClientOriginalName();
                    $comp->file_path = Storage::disk('s3')->url($filepath);
                    $comp->save();
                }
            }

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


    public function indexCompetition()
    {
        try {
            $query = DB::table('competitions')
                ->select(DB::raw("*, ( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day, ( CASE WHEN DATEDIFF( NOW(),event_edate ) >= 0 THEN 'Y' ELSE 'N' END ) AS end_yn"))
                ->where('del_yn', '=','N');
            /**
             * 최근등록순->종료 하위 순
             */
            $query->orderByRaw("FIELD(end_yn,'N','Y'), sid desc");

            $comps = $query->get();

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

    public function indexCompetitionWithSorting(Request $request)
    {
        try {
            $query = DB::table('competitions')
                ->select(DB::raw("*, ( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day , ( CASE WHEN DATEDIFF( NOW(),event_edate ) >= 0 THEN 'Y' ELSE 'N' END ) AS end_yn"))
                ->where('del_yn', '=','N');
//            User::selectRaw("'*, ( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day'")
            /**
             * 모집중:pre/진행중:ing/종료된:end
             */
            switch($request['sorting']){
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

            $comps = $query->get();

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

            $join_teams = Competition_Team::where( ['del_yn' => 'N', 'cid' => $comp->sid ])->get();
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


}
