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
                $s3_path = "gotcha/".$save_id."/thum";
                foreach($request->file('files') as $file){
                    $extension = $file->getClientOriginalExtension();
                    $uuid = uniqid();
                    $filename = $uuid. '_' . time() . '.' . $extension;
                    $filepath = $s3_path . '/' . $filename;

                    // S3에 파일 저장
                    Storage::disk('s3')->put($filepath, $file);

                    $update_team = Team::find($save_id);
                    $update_team->file_name = $file->getClientOriginalName();
                    $update_team->file_path = Storage::disk('s3')->url($filepath);
                    $update_team->save();
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


    public function indexTeams()
    {
        try {
            $teams = Team::where( ['del_yn' => 'N' ])->get();
//            $teams = DB::table('teams')->where( ['del_yn' => 'N' ])->get();

            return response()->json([
                'message' => 'Successfully loaded teams!',
                'state' => "S",
                "data" => ["teams" => $teams],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded teams!',
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

    public function showTeam(String $sid)
    {
        try {
            $team_info = Team::where( [
                    'del_yn' => 'N',
                    'sid' => $sid,
                ]
            )->get();

            $team_users = DB::table('users')
                ->Join('team_users','users.sid','=','team_users.uid')
                ->Join('teams','teams.sid','=','team_users.tid')
                ->select('users.*')
                ->get();

            return response()->json([
                'message' => 'Successfully loaded team!',
                'state' => "S",
                "data" => [
                    "team_info" => $team_info,
                    "team_users" => $team_users,
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

}
