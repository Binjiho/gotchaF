import { useState, useEffect } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import UploadImage from "@/components/image/UploadImage";
import AreaSelect from "@/components/team/AreaSelect";
import { toast } from "react-toastify";
import { sendPost } from "@/helper/api";
import { calculateAge } from "@/helper/value";
import { useRouter } from "next/router";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";
import EditItemSelect from "@/components/team/EditItemSelect";
import { genderTypeList, yearList, personnelList } from "@/constants/UiConstants";

export default function Create() {
  const [teamName, setTeamName] = useState("");
  const [teamContents, setTeamContents] = useState("");
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState([]);
  const [genderType, setGenderType] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [personnel, setPersonnel] = useState("");
  const [formClear, setFormClear] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!minYear || !maxYear) return;

    if (minYear < maxYear) {
      toast("최대나이는 최소나이보다 커야 합니다.");
      setMaxYear("");
    }
  }, [minYear, maxYear]);

  useEffect(() => {
    if (
      !teamName ||
      !teamContents ||
      !file ||
      !address ||
      !genderType ||
      !minYear ||
      !maxYear ||
      !personnel
    ) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [teamName, teamContents, file, address, genderType, minYear, maxYear, personnel]);

  const createTeam = () => {
    const formData = new FormData();
    formData.append("files[]", file);
    formData.append("title", teamName);
    formData.append("contents", teamContents);
    formData.append("region", address[0].name);
    formData.append("limit_person", personnel);
    formData.append("sex", genderType);
    formData.append("min_age", calculateAge(minYear));
    formData.append("max_age", calculateAge(maxYear));

    sendPost(
      "/api/teams",
      formData,
      res => {
        toast("팀이 생성되었습니다");
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
            onClick={createTeam}>
            완료
          </Button>
        </div>
      </PrevHeader>
      <main className={`pb-[20px]`}>
        <Form>
          <div className={`inner`}>
            <Form.Group className={`my-[30px]`}>
              <Form.Control
                placeholder={`팀명 입력(최대 7자)`}
                maxLength={7}
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className={`border-none text-center text-[20px] font-bold placeholder:text-gray7 py-0`}></Form.Control>
            </Form.Group>
            <div className={`m-auto w-fit`}>
              <UploadImage file={file} setFile={setFile}></UploadImage>
            </div>
            <hr className={`border-gray3 mt-[30px] mb-[20px]`} />
            <Form.Group>
              <Form.Control
                as={`textarea`}
                placeholder={`팀 소개글이나 대표 사이트를 입력해주세요. (최대 100자)`}
                value={teamContents}
                rows={4}
                onChange={e => setTeamContents(e.target.value)}
                className={`p-0 border-0 rounded-0 text-[14px] mb-[20px]`}></Form.Control>
            </Form.Group>
          </div>
          <hr className={`hr-line`} />
          <ul className={`inner`}>
            <AreaSelect value={address} setValue={setAddress} title={"지역"}></AreaSelect>
            <EditItemSelect
              placeholder={`성별 선택`}
              title={`성별`}
              value={genderType}
              setValue={setGenderType}
              list={genderTypeList}></EditItemSelect>
            <EditItemSelect
              placeholder={`나이 선택`}
              title={`최소나이`}
              value={minYear}
              setValue={setMinYear}
              list={yearList()}></EditItemSelect>
            <EditItemSelect
              placeholder={`나이 선택`}
              title={`최대나이`}
              value={maxYear}
              setValue={setMaxYear}
              list={yearList()}></EditItemSelect>
            <EditItemSelect
              placeholder={`정원 선택`}
              title={`정원`}
              value={personnel}
              setValue={setPersonnel}
              list={personnelList()}></EditItemSelect>
          </ul>
          <p className={`text-gray7 text-[13px] text-center mt-10`}>
            팀 이름과 사진은 개설 후에도 변경할 수 있어요
          </p>
        </Form>
      </main>
    </>
  );
}
