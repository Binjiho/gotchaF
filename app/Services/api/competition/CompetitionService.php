<?php

namespace App\Services\api\competition;

use App\Models\Competition;

use App\Models\Competition_Team;
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
            $comps = Competition::where( ['del_yn' => 'N' ])->get();
            foreach($comps as $comp_idx => $comp){
                $comp_dday = DB::table('competitions')
                    ->select(DB::raw('( CASE WHEN DATEDIFF( regist_edate,NOW() ) > 0 THEN DATEDIFF(regist_edate,NOW() ) ELSE 0 END ) as d_day'))
                    ->where('del_yn', '=','N')
                    ->first();
                $comps[$comp_idx]['d_day'] = $comp_dday->d_day;

                $team_count = Competition_Team::where( ['del_yn' => 'N', 'cid' => $comp->sid ])->count();
                $comps[$comp_idx]['team_count'] = $team_count;
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
}
