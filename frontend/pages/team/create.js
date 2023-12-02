import { useState } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import UploadImage from "@/components/image/UploadImage";
import AreaSelect from "@/components/team/AreaSelect";
import GenderSelect from "@/components/team/GenderSelect";

export default function Create() {
  const [cityType, setCityType] = useState([]);
  const [detailCityType, setDetailCityType] = useState([]);
  const [genderType, setGenderType] = useState("");

  return (
    <>
      <PrevHeader>
        <div type={"right"}>
          <Button variant={"text"} className={`text-[15px] text-gray7`}>
            완료
          </Button>
        </div>
      </PrevHeader>
      <main className={`pb-[20px]`}>
        <Form>
          <Form.Group className={`my-[30px]`}>
            <Form.Control
              placeholder={`팀명 입력(최대 7자)`}
              maxLength={7}
              className={`border-none text-center text-[20px] font-bold placeholder:text-gray7 py-0`}></Form.Control>
          </Form.Group>
          <div className={`m-auto w-fit`}>
            <UploadImage></UploadImage>
          </div>
          <hr className={`border-gray3 mt-[30px] mb-[20px]`} />
          <Form.Group>
            <Form.Control
              as={`textarea`}
              placeholder={`팀 소개글이나 대표 사이트를 입력해주세요. (최대 100자)`}
              className={`p-0 border-0 rounded-0 text-[14px]`}></Form.Control>
          </Form.Group>
          <hr className={`hr-line`} />
          <ul>
            <AreaSelect
              cityType={cityType}
              setCityType={setCityType}
              detailCityType={detailCityType}
              setDetailCityType={setDetailCityType}></AreaSelect>
            <GenderSelect
              genderType={genderType}
              setGenderType={setGenderType}></GenderSelect>
          </ul>
          <p className={`text-gray7 text-[13px] text-center mt-10`}>
            팀 이름과 사진은 개설 후에도 변경할 수 있어요
          </p>
        </Form>
      </main>
    </>
  );
}
