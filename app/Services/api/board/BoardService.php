<?php

namespace App\Services\api\board;

use App\Models\Board;
use App\Models\Competition_Team;
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
            $user = auth()->user();
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
                $s3_path = "gotcha/teams/".$tid."/notice";
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


    public function indexNotice(Request $request, String $tid)
    {
        try {
            if($request->per_page){
                $per_page = $request->per_page;
            }else{
                $per_page = 10;
            }

            $boards = DB::table('boards')
                ->join('users', 'boards.uid', '=', 'users.sid')

                ->select('boards.*', 'users.file_path as user_thum')
                ->where('boards.ccode', '=', '1')
                ->where('boards.tid', '=', $tid)
                ->where('boards.display_yn', '=', 'Y')
                ->where('boards.del_yn', '=', 'N')
                ->simplePaginate($per_page);

//                $boards = board::where( ['del_yn' => 'N' ])->simplePaginate($per_page);
            return response()->json([
                'message' => 'Successfully loaded 팀공지사항 리스트!',
                'state' => "S",
                "data" => ["boards" => $boards],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded 팀공지사항 리스트!',
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
                ->where('boards.sid', '=', $sid)
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
//            $board = board::where( [
//                    'display_yn' => 'Y',
//                    'del_yn' => 'N',
//                    'tid' => $tid,
//                    'sid' => $sid,
//                ]
//            )->first();
//            if(!$board){
//                return response()->json([
//                    'message' => 'Error load board Notice!',
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
//                $s3_path = "gotcha/teams/".$tid."/notice";
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
                $s3_path = "gotcha/teams/".$tid."/gallery";

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

//============================================================
// 경기 공지/문의
//============================================================

    public function indexInquire(String $cid)
    {
        try {
            $boards = DB::table('boards')
                ->join('teams', 'boards.tid', '=', 'teams.sid')
                ->join('competition_teams as c', function ($join) use ($cid) {
                    $join->on('teams.sid', '=', 'c.tid')
                        ->where('c.cid', '=', $cid);
                })
                ->select('boards.*', 'teams.title as name','teams.file_path as thum', 'c.level')
                ->where('boards.ccode', '=', '3')
                ->where('boards.cid', '=', $cid)
                ->where('boards.display_yn', '=', 'Y')
                ->where('boards.del_yn', '=', 'N')
                ->orderBy('sid','desc')
                ->get();

            $result = array();
            foreach($boards as $board){
                $reply = DB::table('boards')
                    ->select('boards.*', 'teams.title as name','teams.file_path as thum', 'c.level')
                    ->where('boards.ccode', '=', '3')
                    ->where('boards.cid', '=', $cid)
                    ->where('boards.display_yn', '=', 'Y')
                    ->where('boards.del_yn', '=', 'N')
                    ->where('boards.step', '=', '2')
                    ->count();

                $result[] = array(
                  'sid' => $board->sid,
                  'team_name' => $board->name,
                  'thum' => $board->thum,
                  'level' => $board->level,
                  'title' => $board->title,
                  'contents' => $board->contents,
                  'file' => $board->file_path,
                  'created_at' => $board->created_at,
                  'reply_cnt' => $reply,
                  'hit_cnt' => $board->hit,
                );

            }

            return response()->json([
                'message' => '경기 공지/문의 불러오기 성공!',
                'state' => "S",
                "data" => ["result" => $result],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '경기 공지/문의 불러오기 실패!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function showInquire(String $cid,  String $sid)
    {
        try {
            $board = DB::table('boards')
                ->join('teams', 'boards.tid', '=', 'teams.sid')
                ->join('competition_teams as c', function ($join) use ($cid) {
                    $join->on('teams.sid', '=', 'c.tid')
                        ->where('c.cid', '=', $cid);
                })
                ->select('boards.*', 'teams.title as name','teams.file_path as thum', 'c.level')
                ->where('boards.ccode', '=', '3')
                ->where('boards.cid', '=', $cid)
                ->where('boards.display_yn', '=', 'Y')
                ->where('boards.del_yn', '=', 'N')
                ->where('boards.sid', '=', $sid)
                ->first();

            $replys = DB::table('boards')
                ->select('boards.*')
                ->where('boards.ccode', '=', '3')
                ->where('boards.cid', '=', $cid)
                ->where('boards.display_yn', '=', 'Y')
                ->where('boards.del_yn', '=', 'N')
                ->where('boards.step', '=', '2')
                ->orderBy('boards.sid','desc')
                ->get();

            $result = array(
                'sid' => $board->sid,
                'team_name' => $board->name,
                'level' => $board->level,
                'title' => $board->title,
                'contents' => $board->contents,
                'file' => $board->file_path,
                'created_at' => $board->created_at,
                'reply' => $replys,
                'hit_cnt' => $board->hit,
            );

            return response()->json([
                'message' => '경기 공지/문의 상세 불러오기 성공!',
                'state' => "S",
                "data" => ["result" => $result],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '경기 공지/문의 상세 불러오기 실패!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }
    public function storeInquire(Request $request, String $cid)
    {
        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        //팀의 리더인지 확인
        $leader_user = Team_User::where( [
            'del_yn' => 'N',
            'uid' => $user->sid,
            'level' => 'L'
        ])->first();
        if(!$leader_user){
            return response()->json([
                'message' => '팀의 리더가 아닙니다!',
                'state' => "E",
            ], 555);
        }

        //경기에 참여한 팀인지 확인
        $competition_join = Competition_Team::where( [
            'del_yn' => 'N',
            'cid' => $cid,
            'tid' => $leader_user->tid,
        ])->first();
        if(!$competition_join){
            return response()->json([
                'message' => '경기에 참여한 팀이 아닙니다!',
                'state' => "E",
            ], 555);
        }

        try {
            $this->transaction();

            $now = date('Y-m-d H:i:s');

            $board = new Board;
            $board->ccode = 3;
            $board->cid = $cid;
            $board->tid = $leader_user->tid;
            $board->uid = $user->sid;
            $board->title = $request->title;
            $board->contents = $request->contents;
            $board->writer = $user->name;
            $board->created_at = $now;
            $board->save();
            $save_id = $board->sid;

            if($request->hasFile('files')){
                $s3_path = "gotcha/inquire/".$cid;
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

            $this->dbCommit('경기 공지/문의 생성');

            return response()->json([
                'message' => 'Successfully created board Inquire!',
                'state' => "S",
                "data" => [ "board" => $board ],
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error board Inquire!',$e);
        }
    }

    public function updateInquire(Request $request, String $cid, String $sid)
    {
        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        $board = Board::where( [
            'sid' => $sid,
            'uid' => $user->sid,
        ])->first();
        if(!$board){
            return response()->json([
                'message' => '게시글 작성자가 아닙니다!',
                'state' => "E",
            ], 555);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $this->transaction();

            if($request->title) $board->title = $request->title;
            if($request->contents) $board->contents = $request->contents;
            if($request->del_yn) $board->del_yn = $request->del_yn;

            $board->updated_at = $now;

            if($request->hasFile('files')){
                $s3_path = "gotcha/inquire/".$cid;

                //기존 이미지 삭제
                if($board->file_path){
                    $file_uploaded_name = $board->file_realname;
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
                        $board->file_originalname = $file->getClientOriginalName();
                        $board->file_realname = $filename;
                        $board->file_path = Storage::disk('s3')->url($filepath);
                    }
                }
            }

            $board->save();

            $this->dbCommit('경기 공지/문의 수정 및 삭제');

            return response()->json([
                'message' => 'Successfully update delete Inquire!',
                'state' => "S",
                "data" => ["board" => $board],
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('Error update delete Inquire!',$e);
        }
    }

    public function replyInquire(Request $request, String $sid)
    {
        $user = auth()->user();
        if(!$user){
            return response()->json([
                'message' => 'Error load User!',
                'state' => "E",
            ], 500);
        }

        $motherBoard = Board::where( [
            'sid' => $sid,
            'del_yn' => 'N',
        ])->first();
        if(!$motherBoard){
            return response()->json([
                'message' => '게시글이 존재하지 않습니다!',
                'state' => "E",
            ], 500);
        }

        try {
            $now = date('Y-m-d H:i:s');

            $this->transaction();

            $board = new Board;
            $board->ccode = 3;
            $board->step = 2;
            $board->cid = $motherBoard->cid;
            $board->uid = $user->sid;
            $board->title = $request->title;
            $board->contents = $request->contents;
            $board->writer = $user->name;
            $board->created_at = $now;
            $board->save();

            $this->dbCommit('경기 공지/문의 댓글달기');

            return response()->json([
                'message' => '경기 공지/문의 댓글달기 성공!',
                'state' => "S",
                "data" => ["board" => $board],
            ], 200);
        } catch (\Exception $e) {
            return $this->dbRollback('경기 공지/문의 댓글달기 실패!',$e);
        }
    }

}
