<?php

namespace App\Http\Controllers\api\Board;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Board;
use App\Services\api\board\BoardService;

class BoardController extends Controller
{
    public function __construct(Request $request, private BoardService $boardService)
    {
//        view()->share('main_menu', 'M10');
    }


    /**
     * @OA\Post (
     *     path="/api/boards",
     *     tags={"게시판"},
     *     description="게시판 생성",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="ccode", type="string", description="팀게시판:1", example="1"),
     *                 @OA\Property (property="tid", type="string", description="팀아이디", example="10"),
     *                 @OA\Property (property="uid", type="string", description="유저아이디(토큰으로 getUser후 userId전달)", example="234"),
     *                 @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                 @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                 @OA\Property (property="writer", type="string", description="작성자", example="작성자"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeBoard(Request $request)
    {
        return $this->boardService->storeBoard($request);
    }

    /**
     * @OA\Get (
     *     path="/api/boards",
     *     tags={"게시판"},
     *     description="게시판 리스트 불러오기 ",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function indexBoards()
    {
        return $this->boardService->indexBoards();
    }

    /**
     * @OA\Get (
     *     path="/api/boards/{$sid}",
     *     tags={"게시판"},
     *     description="게시판 상세 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showBoard(String $sid)
    {
        return $this->boardService->showBoard($sid);
    }

    /**
     * @OA\Patch  (
     *     path="/api/boards/{$sid}",
     *     tags={"게시판"},
     *     description="게시판 삭제 (display_yn='n') ",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function deleteBoard(String $sid)
    {
        return $this->boardService->deleteBoard($sid);
    }
}
