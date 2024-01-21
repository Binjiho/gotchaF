<?php

namespace App\Services\api\board;

use App\Models\Board;
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
class BoardService extends Services
{
    public function storeNotice(Request $request, String $tid)
    {
        try {

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
                'tid' => $tid,
                'level' => 'L'
            ])->first();
            if(!$leader_user){
                return response()->json([
                    'message' => 'Error load Leader User!',
                    'state' => "E",
                ], 555);
            }

            $now = date('Y-m-d H:i:s');

            $board = new Board;
            $board->ccode = 1;
            $board->tid = $tid;
            $board->uid = $user->sid;
            $board->title = $request->title;
            $board->contents = $request->contents;
            $board->writer = $user->name;
            $board->created_at = $now;
            $board->save();
            $save_id = $board->sid;

            if($request->hasFile('files')){
                $s3_path = "gotcha/".$tid."/notice";
                foreach($request->file('files') as $file){
                    $extension = $file->getClientOriginalExtension();
                    $uuid = uniqid();
                    $filename = $uuid. '_' . time() . '.' . $extension;
                    $filepath = $s3_path . '/' . $filename;

                    // S3에 파일 저장
                    Storage::disk('s3')->put($filepath, $file);

                    $board = Board::find($save_id);
                    $board->file_originalname = $file->getClientOriginalName();
                    $board->file_realname = $filename;;
                    $board->file_path = Storage::disk('s3')->url($filepath);
                    $board->save();
                }
            }


            $this->dbCommit('경기 생성');

            return response()->json([
                'message' => 'Successfully created board Notice!',
                'state' => "S",
                "data" => [ "board" => $board ],
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error board Notice!',$e);
        }

    }


    public function indexNotice(String $tid)
    {
        try {
            $boards = DB::table('boards')
                ->join('users', 'boards.uid', '=', 'users.sid')
                ->join('team_users', function ($join) use ($tid) {
                    $join->on('users.sid', '=', 'team_users.uid')
                        ->where('team_users.tid', '=', $tid);
                })
                ->select('boards.*', 'users.file_path as user_thum', 'team_users.level')
                ->where('boards.ccode', '=', '1')
                ->where('boards.tid', '=', $tid)
                ->where('boards.display_yn', '=', 'Y')
                ->where('boards.del_yn', '=', 'N')
                ->paginate(10);

            return response()->json([
                'message' => 'Successfully loaded board Notices!',
                'state' => "S",
                "data" => ["boards" => $boards],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded board Notices!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }


    public function showNotice(String $tid, String $sid)
    {
        try {
            $board = DB::table('boards')
                ->join('users', 'boards.uid', '=', 'users.sid')
                ->join('team_users', 'boards.uid', '=', 'team_users.uid')
                ->select('boards.*', 'users.file_path as user_thum', 'team_users.level')
                ->where('boards.ccode', '=', '1')
                ->where('boards.tid', '=', $tid)
                ->where('boards.display_yn', '=', 'Y')
                ->where('boards.del_yn', '=', 'N')
                ->first();

            if(!$board){
                return response()->json([
                    'message' => 'Error load Notice!',
                    'state' => "E",
                ], 500);
            }

            $level = DB::table('team_users')
                ->select('team_users.level')
                ->where('team_users.uid', '=', $board->uid)
                ->where('team_users.tid', '=', $tid)
                ->first();
            $board->level = $level->level;

            return response()->json([
                'message' => 'Successfully loaded Notice!',
                'state' => "S",
                "data" => ["board" => $board],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded Notice!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }


//    public function updateNotice(Request $request, String $tid, String $sid)
//    {
//        try {
//            $user = $request->user();
//            if(!$user){
//                return response()->json([
//                    'message' => 'Error load User!',
//                    'state' => "E",
//                ], 500);
//            }
//
//            $leader_user = Team_User::where( [
//                'del_yn' => 'N',
//                'uid' => $user->sid,
//                'tid' => $tid,
//                'level' => 'L'
//            ])->first();
//            if(!$leader_user){
//                return response()->json([
//                    'message' => 'Error load Leader User!',
//                    'state' => "E",
//                ], 555);
//            }
//
//            $board = Board::where( [
//                    'display_yn' => 'Y',
//                    'del_yn' => 'N',
//                    'tid' => $tid,
//                    'sid' => $sid,
//                ]
//            )->first();
//            if(!$board){
//                return response()->json([
//                    'message' => 'Error load Board Notice!',
//                    'state' => "E",
//                ], 500);
//            }
//
//            $this->transaction();
//
//            $now = date('Y-m-d H:i:s');
//
//            if($request->title) $board->title = $request->title;
//            if($request->contents) $board->contents = $request->contents;
//            if($request->del_yn) $board->del_yn = $request->del_yn;
//
//            $board->updated_at = $now;
//
//            if($request->hasFile('files')){
//                $s3_path = "gotcha/".$tid."/notice";
//
//                //기존 이미지 삭제
//                if($board->file_path){
//                    $file_uploaded_name = $board->file_realname;
//                    $file_uploaded_path = $s3_path."/".$file_uploaded_name;
//                    // Delete a file
//                    Storage::disk('s3')->delete($file_uploaded_path);
//                }
//
//                //새로운 이미지 저장
//                foreach($request->file('files') as $file){
//                    if ($file->isValid()) {
//                        $extension = $file->getClientOriginalExtension();
//                        $uuid = uniqid();
//                        $filename = $uuid. '_' . time() . '.' . $extension;
//                        $filepath = $s3_path . '/' . $filename;
//
//                        // S3에 파일 저장
//                        Storage::disk('s3')->put($filepath, file_get_contents($file));
//                        $board->file_originalname = $file->getClientOriginalName();
//                        $board->file_realname = $filename;
//                        $board->file_path = Storage::disk('s3')->url($filepath);
//                    }
//                }
//            }
//
//            $board->save();
//
//            $this->dbCommit('팀 공지사항 수정 및 삭제');
//
//            return response()->json([
//                'message' => 'Successfully update delete Notice!',
//                'state' => "S",
//                "data" => ["board" => $board],
//            ], 200);
//        } catch (\Exception $e) {
//            return $this->dbRollback('Error update delete Notice!',$e);
//        }
//    }



    public function storeGallery(Request $request, String $tid)
    {
        $this->transaction();

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
            'tid' => $tid,
            'level' => 'L'
        ])->first();
        if(!$leader_user){
            return response()->json([
                'message' => 'Error load Leader User!',
                'state' => "E",
            ], 555);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $board = new Board;
            $board->ccode = 2;
            $board->tid = $tid;
            $board->uid = $user->sid;
            $board->title = "팀이미지";
            $board->contents = "팀이미지";
            $board->writer = $user->name;
            $board->created_at = $now;

            if($request->hasFile('files')){
                $s3_path = "gotcha/".$tid."/gallery";

                foreach($request->file('files') as $file){
                    if ($file->isValid()) {
                        $extension = $file->getClientOriginalExtension();
                        $uuid = uniqid();
                        $filename = $uuid. '_' . time() . '.' . $extension;
                        $filepath = $s3_path . '/' . $filename;
                        // S3에 파일 저장
                        Storage::disk('s3')->put($filepath, file_get_contents($file));

                        $board->file_originalname = $file->getClientOriginalName();
                        $board->file_realname = $filename;
                        $board->file_path = Storage::disk('s3')->url($filepath);
                    }
                }
            }

            $board->save();

            $this->dbCommit('팀 갤러리 이미지 생성');

            return response()->json([
                'message' => 'Successfully created teamImage!',
                'state' => "S",
                "data" => [ "board" => $board ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error created teamImage!',$e);

        }
    }

    public function indexGallery(String $tid)
    {
        try {
            $boards = Board::where( [
                'del_yn' => 'N',
                'ccode' => 2,
                'tid' => $tid
            ])->get();

            return response()->json([
                'message' => 'Successfully load teamImage!',
                'state' => "S",
                "data" => [ "boards" => $boards ],
            ], 200);
        } catch (\Exception $e) {

            return $this->dbRollback('Error load teamImage!',$e);

        }
    }

}
