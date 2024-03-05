<?php

namespace App\Http\Controllers\api\board;

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
     *     path="/api/boards/board-gallery/{tid}",
     *     tags={"게시판"},
     *     description="팀 갤러리 사진 생성",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="tid", type="string", description="팀아이디", example="1"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeGallery(Request $request, String $tid)
    {
        return $this->boardService->storeGallery($request, $tid);
    }

    /**
     * @OA\Get (
     *     path="/api/boards/board-gallery/{tid}",
     *     tags={"게시판"},
     *     description="팀 갤러리 사진 리스트",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function indexGallery(String $tid)
    {
        return $this->boardService->indexGallery($tid);
    }

    /**
     * @OA\Get (
     *     path="/api/boards/board-notice/{tid}{per_page?}{page?}",
     *     tags={"게시판"},
     *     description="팀 공지사항 리스트 [per_page=>페이지 당 레코드 갯수] [page =>보여줄 페이지]",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function indexNotice(Request $request,String $tid)
    {
        return $this->boardService->indexNotice($request, $tid);
    }

    /**
     * @OA\Get (
     *     path="/api/boards/board-notice/{tid}/{sid}",
     *     tags={"게시판"},
     *     description="팀 공지사항 상세 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showNotice(String $tid, String $sid)
    {
        return $this->boardService->showNotice($tid, $sid);
    }


    /**
     * @OA\Post (
     *     path="/api/boards/board-notice/{tid}",
     *     tags={"게시판"},
     *     description="팀 공지사항 생성",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                 @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeNotice(Request $request, String $tid)
    {
        return $this->boardService->storeNotice($request, $tid);
    }

    /**
     * @OA\Post  (
     *     path="/api/boards/board-notice/{tid}/{sid}",
     *     tags={"게시판"},
     *     description="팀 공지사항 게시판 수정 및 삭제",
     *       @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema (
     *                  @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                  @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                  @OA\Property (property="del_yn", type="string", description="삭제유무", example="Y"),
     *                  @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *              )
     *          )
     *      ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function updateNotice(Request $request, String $tid, String $sid)
    {
        return $this->boardService->updateNotice($request, $tid, $sid);
    }

    /**
     * @OA\Get (
     *     path="/api/boards/board-inquire/{cid}",
     *     tags={"게시판"},
     *     description="경기 공지/문의 리스트",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function indexInquire(String $cid)
    {
        return $this->boardService->indexInquire($cid);
    }

    /**
     * @OA\Get (
     *     path="/api/boards/board-inquire/{cid}/{sid}",
     *     tags={"게시판"},
     *     description="경기 공지/문의  상세 불러오기",
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function showInquire(String $cid, String $sid)
    {
        return $this->boardService->showInquire($cid, $sid);
    }

    /**
     * @OA\Post (
     *     path="/api/boards/board-inquire/{cid}",
     *     tags={"게시판"},
     *     description="경기 공지/문의 생성",
     *      @OA\RequestBody(
     *         required=true,
     *         @OA\MediaType(
     *             mediaType="application/json",
     *             @OA\Schema (
     *                 @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                 @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                 @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *             )
     *         )
     *     ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function storeInquire(Request $request, String $cid)
    {
        return $this->boardService->storeInquire($request, $cid);
    }

    /**
     * @OA\Post  (
     *     path="/api/boards/board-inquire/{tid}/{sid}",
     *     tags={"게시판"},
     *     description="경기 공지/문의 수정 및 삭제",
     *       @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema (
     *                  @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                  @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                  @OA\Property (property="del_yn", type="string", description="삭제유무", example="Y"),
     *                  @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *              )
     *          )
     *      ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function updateInquire(Request $request, String $cid, String $sid)
    {
        return $this->boardService->updateInquire($request, $cid, $sid);
    }

    /**
     * @OA\Post  (
     *     path="/api/boards/board-reply/{sid}",
     *     tags={"게시판"},
     *     description="경기 공지/문의 댓글달기",
     *       @OA\RequestBody(
     *          required=true,
     *          @OA\MediaType(
     *              mediaType="application/json",
     *              @OA\Schema (
     *                  @OA\Property (property="title", type="string", description="제목", example="제목"),
     *                  @OA\Property (property="contents", type="string", description="내용", example="내용"),
     *                  @OA\Property (property="files[]", type="file", description="이미지 input name=files[]", example="file.jpg"),
     *              )
     *          )
     *      ),
     *     @OA\Response(response="200", description="Success"),
     *     @OA\Response(response="500", description="Fail")
     * )
     */
    public function replyInquire(Request $request, String $sid)
    {
        return $this->boardService->replyInquire($request, $sid);
    }

}
