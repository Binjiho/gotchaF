import PrevHeader from "@/components/layout/PrevHeader";
import { useEffect, useState } from "react";
import { sendPost } from "@/helper/api";
import { toast } from "react-toastify";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import UploadContentImage from "@/components/image/UploadContentImage";
import ResizeTextarea from "@/components/form/ResizeTextarea";

export default function Create() {
  const [consultTitle, setConsultTitle] = useState("");
  const [consultContents, setConsultContents] = useState("");
  const [formClear, setFormClear] = useState(false);
  const [file, setFile] = useState(null);
  const router = useRouter();
  const consultId = router.query.id;

  useEffect(() => {
    if (!consultTitle || !consultContents) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [consultTitle, consultContents]);

  const createTeam = () => {
    const formData = new FormData();
    formData.append("files[]", file);
    formData.append("title", consultTitle);
    formData.append("contents", consultContents);

    sendPost(
      `/api/boards/board-inquire/${consultId}`,
      formData,
      res => {
        toast("공지/문의가 생성되었습니다.");
        router.back();
      },
      err => {
        toast(err.response.data.message);
      },
      REQUEST_HEADER_CONTENTS_FORM
    );
  };

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          글쓰기
        </h2>
        <div type={"right"}>
          <Button
            variant={"text"}
            className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray7`}
            disabled={!formClear}
            onClick={createTeam}>
            등록
          </Button>
        </div>
      </PrevHeader>
      <main className={`pb-[20px]`}>
        <Form>
          <Form.Group className={`my-[18px] inner`}>
            <Form.Control
              type="text"
              placeholder={`제목을 입력해주세요`}
              value={consultTitle}
              onChange={e => setConsultTitle(e.target.value)}
              className={`border-none p-0 text-[16px]`}></Form.Control>
          </Form.Group>
          <hr className={"hr-line !h-[1px]"} />
          <div className={`inner`}>
            <Form.Group className={`my-[18px] `}>
              <ResizeTextarea
                value={consultContents}
                setValue={setConsultContents}
                className={`p-0 border-0 rounded-0 text-[16px] mb-[20px] resize-none`}></ResizeTextarea>
            </Form.Group>
            <UploadContentImage file={file} setFile={setFile}></UploadContentImage>
          </div>
        </Form>
      </main>
    </>
  );
}
