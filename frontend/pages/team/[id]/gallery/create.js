import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import UploadImage from "@/components/image/UploadImage";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sendPost } from "@/helper/api";
import { toast } from "react-toastify";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";

export default function Create() {
  const [file, setFile] = useState(null);
  const router = useRouter();
  const teamId = router.query.id;
  const [formClear, setFormClear] = useState(false);

  useEffect(() => {
    if (!file) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [file]);

  const createBoardGallery = () => {
    const formData = new FormData();
    formData.append("files[]", file);

    sendPost(
      `/api/boards/board-gallery/${teamId}`,
      formData,
      res => {
        toast("사진이 등록되었습니다");
        router.back();
      },
      () => {},
      REQUEST_HEADER_CONTENTS_FORM
    );
  };

  return (
    <>
      <PrevHeader>
        <div type={"right"}>
          <Button
            variant={"text"}
            className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray7`}
            disabled={!formClear}
            onClick={createBoardGallery}>
            완료
          </Button>
        </div>
      </PrevHeader>
      <main>
        <Form className={`py-[20px]`}>
          <div className={`m-auto w-fit`}>
            <UploadImage file={file} setFile={setFile}></UploadImage>
          </div>
        </Form>
      </main>
    </>
  );
}
