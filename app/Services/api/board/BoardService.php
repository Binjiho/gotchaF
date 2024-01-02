<?php

namespace App\Services\api\board;

use App\Models\Board;
use App\Models\Team;
use App\Models\Team_User;
use App\Services\Services;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

/**
 * Class AuthServices
 * @package App\Services
 */
class BoardService extends Services
{
    public function storeBoard(Request $request)
    {
        try {
            $now = date('Y-m-d H:i:s');

            $board = new Board;
            $board->ccode = $request->ccode;
            $board->tid = $request->tid;
            $board->uid = $request->uid;
            $board->title = $request->title;
            $board->contents = $request->contents;
            $board->writer = $request->writer;
            $board->created_at = $now;
            $board->save();
            $save_id = $board->sid;

            if($request->hasFile('files')){
                $s3_path = "gotcha/boards/".$save_id;
                foreach($request->file('files') as $file){
                    $extension = $file->getClientOriginalExtension();
                    $uuid = uniqid();
                    $filename = $uuid. '_' . time() . '.' . $extension;
                    $filepath = $s3_path . '/' . $filename;

                    // S3에 파일 저장
                    Storage::disk('s3')->put($filepath, $file);

                    $board = Board::find($save_id);
                    $board->file_name = $file->getClientOriginalName();
                    $board->file_path = Storage::disk('s3')->url($filepath);
                    $board->save();
                }
            }
            return response()->json([
                'message' => 'Successfully created board!',
                'state' => "S",
                "data" => [ "board" => $board ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error create board!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }


    public function indexBoards()
    {
        try {
            $boards = Board::where( [
                'display_yn' => 'Y',
            ])->get();
            return response()->json([
                'message' => 'Successfully loaded boards!',
                'state' => "S",
                "data" => ["boards" => $boards],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded teams!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }


    public function showBoard(String $tid)
    {
        try {
            $board = Board::where( [
                    'display_yn' => 'Y',
                    'tid' => $tid,
                ]
            )->get();

            if(!$board){
                return response()->json([
                    'message' => 'Error load Board!',
                    'state' => "E",
                ], 500);
            }

            return response()->json([
                'message' => 'Successfully loaded board!',
                'state' => "S",
                "data" => ["board" => $board],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error loaded board!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

    public function deleteBoard(String $tid)
    {
        try {
            $board = Board::where( [
                    'del_yn' => 'N',
                    'tid' => $tid,
                ]
            )->get();
            if(!$board){
                return response()->json([
                    'message' => 'Error load Board!',
                    'state' => "E",
                ], 500);
            }

            $now = date('Y-m-d H:i:s');
            $board->display_yn = 'N';
            $board->updated_at = $now;

            return response()->json([
                'message' => 'Successfully delete board!',
                'state' => "S",
                "data" => ["board" => $board],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error delete board!',
                'state' => "E",
                'error' => $e,
            ], 500);
        }
    }

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
