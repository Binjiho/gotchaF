import PrevHeader from "@/components/layout/PrevHeader";
import { useEffect, useState } from "react";
import { sendGet, sendPost } from "@/helper/api";
import { toast } from "react-toastify";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import UploadContentImage from "@/components/image/UploadContentImage";
import ResizeTextarea from "@/components/form/ResizeTextarea";

export default function Create() {
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContents, setNoticeContents] = useState("");
  const [formClear, setFormClear] = useState(false);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const teamId = router.query.id;
  const editId = router.query.edit;

  useEffect(() => {
    if (!noticeTitle || !noticeContents) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [noticeTitle, noticeContents]);

  useEffect(() => {
    if (editId) {
      getNotice();
    }
  }, [editId]);

  const getNotice = function () {
    sendGet(`/api/boards/board-notice/${teamId}/${editId}`, null, res => {
      const notice = res.data.board;

      setNoticeTitle(notice.title);
      setNoticeContents(notice.contents);
      setFile(notice.file_path);
    });
  };

  const getFormData = () => {
    const formData = new FormData();
    formData.append("files[]", file);
    formData.append("title", noticeTitle);
    formData.append("contents", noticeContents);

    return formData;
  };

  const createNotice = () => {
    const formData = getFormData();

    sendPost(
      `/api/boards/board-notice/${teamId}`,
      formData,
      res => {
        toast("공지가 생성되었습니다.");
        router.back();
      },
      () => {},
      REQUEST_HEADER_CONTENTS_FORM
    );
  };

  const editNotice = () => {
    const formData = getFormData();

    formData.append("del_yn", "N");

    sendPost(
      `/api/boards/board-notice/${teamId}/${editId}`,
      formData,
      res => {
        toast("공지가 수정되었습니다.");
        router.back();
      },
      () => {},
      REQUEST_HEADER_CONTENTS_FORM
    );
  };

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          {editId ? "글 수정하기" : "글쓰기"}
        </h2>
        <div type={"right"}>
          {editId ? (
            <Button
              variant={"text"}
              className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray7`}
              disabled={!formClear}
              onClick={editNotice}>
              수정
            </Button>
          ) : (
            <Button
              variant={"text"}
              className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray7`}
              disabled={!formClear}
              onClick={createNotice}>
              등록
            </Button>
          )}
        </div>
      </PrevHeader>
      <main className={`pb-[20px]`}>
        <Form>
          <Form.Group className={`my-[18px] inner`}>
            <Form.Control
              type="text"
              placeholder={`제목을 입력해주세요`}
              value={noticeTitle}
              onChange={e => setNoticeTitle(e.target.value)}
              className={`border-none p-0 text-[16px]`}></Form.Control>
          </Form.Group>
          <hr className={"hr-line !h-[1px]"} />
          <div className={`inner`}>
            <Form.Group className={`my-[18px] `}>
              <ResizeTextarea
                value={noticeContents}
                setValue={setNoticeContents}
                className={`p-0 border-0 rounded-0 text-[16px] mb-[20px] resize-none`}></ResizeTextarea>
            </Form.Group>
            <UploadContentImage file={file} setFile={setFile}></UploadContentImage>
          </div>
        </Form>
      </main>
    </>
  );
}
