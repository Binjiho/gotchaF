<?php

namespace App\Services\api\board;

use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

/**
 * Class AuthServices
 * @package App\Services
 */
class BoardService
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

                    $update_board = Board::find($save_id);
                    $update_board->file_name = $file->getClientOriginalName();
                    $update_board->file_path = Storage::disk('s3')->url($filepath);
                    $update_board->save();
                }
            }
            return response()->json([
                'message' => 'Successfully created board!',
                'state' => "S",
                "data" => [ "board" => $update_board , "save_id"=>$save_id ],
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


    public function showBoard(String $sid)
    {
        try {
            $board = Board::where( [
                    'display_yn' => 'Y',
                    'sid' => $sid,
                ]
            )->get();

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

    public function deleteBoard(String $sid)
    {
        try {
            $board = Board::where( [
                    'del_yn' => 'N',
                    'sid' => $sid,
                ]
            )->get();

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

}
