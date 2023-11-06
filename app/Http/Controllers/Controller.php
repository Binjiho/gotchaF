<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(title="My Fsirst API", version="0.1")
 **/
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * @OA\Post (
     *     path="/boards",
     *     tags={"게시판"},
     *     summary="게시글 등록",
     *     description="게시글을 등록",
     *     @OA\RequestBody(
     *         description="게시글 정보",
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="board_title", type="string", description="게시글 제목", example="공지사항입니다."),
     *                 @OA\Property (property="board_content", type="string", description="게시글 내용", example="공지사항 내용입니다.")
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="400", description="Fail")
     * )
     */
    public function store(Request $request) {

        $request = $request->validate([
            'board_title' => 'required',
            'board_content' => 'required'
        ]);
        $this->board->create([
            'board_title' => $request['board_title'],
            'board_content' => $request['board_content'],
            'created_at' => now(),
            'updated_at' => null
        ]);

        return redirect()->route('board.index');
    }
}
