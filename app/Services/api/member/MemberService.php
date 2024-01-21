<?php

namespace App\Services\api\member;

use App\Models\Board;
use App\Models\Team_User;
use App\Models\User;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

/**
 * Class AuthServices
 * @package App\Services
 */
class MemberService extends Services
{
    public function myInfo(Request $request)
    {
        try {
            $user = auth()->user();

            $team_users = DB::table('users')
                ->leftJoin('team_users','users.sid','=','team_users.uid')
                ->leftJoin('teams','teams.sid','=','team_users.tid')
                ->select('teams.sid','team_users.level')
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
