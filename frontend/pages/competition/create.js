import { useState, useEffect } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import AreaSelect from "@/components/team/AreaSelect";
import { toast } from "react-toastify";
import { sendPost } from "@/helper/api";
import { calculateAge } from "@/helper/value";
import { useRouter } from "next/router";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";
import UploadCover from "@/components/image/UploadCover";
import EditItemSelect from "@/components/team/EditItemSelect";
import { competitionKindList, teamLengthList } from "@/constants/UiConstants";

export default function Create() {
  const [teamName, setTeamName] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState([]);
  const [teamLength, setTeamLength] = useState("");
  const [competitionKind, setCompetitionKind] = useState("");

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
      !title ||
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
  }, [teamName, title, file, address, genderType, minYear, maxYear, personnel]);

  const createTeam = () => {
    const formData = new FormData();
    formData.append("files[]", file);
    formData.append("title", teamName);
    formData.append("contents", title);
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
          <UploadCover file={file} setFile={setFile}></UploadCover>
          <Form.Group>
            <Form.Control
              as={`textarea`}
              placeholder={`리그 이름을 입력해주세요. (최대 30자)`}
              value={title}
              rows={1}
              onChange={e => setTitle(e.target.value)}
              className={`p-0 border-0 rounded-0 text-[14px] my-[20px] !min-h-fit`}></Form.Control>
          </Form.Group>
          <hr className={`hr-line`} />
          <ul>
            <EditItemSelect
              placeholder={`팀 수 선택`}
              title={`참가팀 수`}
              value={teamLength}
              setValue={setTeamLength}
              list={teamLengthList()}></EditItemSelect>
            <AreaSelect
              value={address}
              setValue={setAddress}
              title={"경기 희망 지역"}></AreaSelect>
            <EditItemSelect
              placeholder={`종목 선택`}
              title={`종목`}
              value={competitionKind}
              setValue={setCompetitionKind}
              list={competitionKindList}></EditItemSelect>
          </ul>
          <p className={`text-gray7 text-[13px] text-center mt-10`}>
            팀 이름과 사진은 개설 후에도 변경할 수 있어요
          </p>
        </Form>
      </main>
    </>
  );
}
