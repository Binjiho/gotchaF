import { useState, useEffect } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import UploadImage from "@/components/image/UploadImage";
import AreaSelect from "@/components/team/AreaSelect";
import GenderSelect from "@/components/team/GenderSelect";
import YearSelect from "@/components/team/YearSelect";
import PersonnelSelect from "@/components/team/PersonnelSelect";
import { toast } from "react-toastify";
import { sendPost } from "@/helper/api";
import { calculateAge } from "@/helper/value";

export default function Create() {
  const [teamName, setTeamName] = useState("");
  const [teamContents, setTeamContents] = useState("");
  const [file, setFile] = useState(null);
  const [cityType, setCityType] = useState([]);
  const [detailCityType, setDetailCityType] = useState([]);
  const [genderType, setGenderType] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [personnel, setPersonnel] = useState("");
  const [formClear, setFormClear] = useState(false);

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
      !detailCityType ||
      !genderType ||
      !minYear ||
      !maxYear ||
      !personnel
    )
      return;

    setFormClear(true);
  }, [
    teamName,
    teamContents,
    file,
    detailCityType,
    genderType,
    minYear,
    maxYear,
    personnel,
  ]);

  const createTeam = () => {
    const data = {
      title: teamName,
      contents: teamContents,
      region: detailCityType.name,
      "limit_person": personnel,
      sex: genderType,
      "min_age": calculateAge(minYear),
      "max_age": calculateAge(maxYear),
      "files[]": file,
    };
    sendPost("/api/teams", data, res => {
      console.log(res);
    });
  };

  return (
    <>
      <PrevHeader>
        <div type={"right"}>
          <Button
            variant={"text"}
            className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray-700`}
            disabled={!formClear}
            onClick={createTeam}>
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
              onChange={e => setTeamContents(e.target.value)}
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
            <YearSelect
              year={minYear}
              setYear={setMinYear}
              title={`최소나이`}></YearSelect>
            <YearSelect
              year={maxYear}
              setYear={setMaxYear}
              title={`최대나이`}></YearSelect>
            <PersonnelSelect
              personnel={personnel}
              setPersonnel={setPersonnel}></PersonnelSelect>
          </ul>
          <p className={`text-gray7 text-[13px] text-center mt-10`}>
            팀 이름과 사진은 개설 후에도 변경할 수 있어요
          </p>
        </Form>
      </main>
    </>
  );
}
