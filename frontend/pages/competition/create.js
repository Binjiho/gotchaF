import { useState, useEffect } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import AreaSelect from "@/components/team/AreaSelect";
import { toast } from "react-toastify";
import { sendPost } from "@/helper/api";
import { useRouter } from "next/router";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";
import UploadCover from "@/components/image/UploadCover";
import EditItemSelect from "@/components/team/EditItemSelect";
import {
  competitionKindList,
  frequencyGameList,
  numberPlayersList,
  teamLengthList,
} from "@/constants/UiConstants";
import EditItemDateSelect from "@/components/team/EditItemDateSelect";
import EditItemWeekSelect from "@/components/team/EditItemWeekSelect";
import { useSelector } from "react-redux";
import { COMPETITION_TYPE } from "@/constants/serviceConstants";

export default function Create() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState([]);
  const [teamLength, setTeamLength] = useState("");
  const [competitionKind, setCompetitionKind] = useState("");
  const [numberPlayers, setNumberPlayers] = useState("");
  const [frequencyGame, setFrequencyGame] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekDate, setWeekDate] = useState([]);
  const [formClear, setFormClear] = useState(false);
  const router = useRouter();
  const user = useSelector(state => state.user);
  const competitionType = Number(router.query.type);

  useEffect(() => {
    if (!startDate || !endDate) return;

    if (endDate < startDate) {
      toast("희망일은 마감일보다 빨라야 합니다.");
      setEndDate("");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!title || !file || !address) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [title, file, address]);

  const createCompetition = () => {
    const formData = new FormData();
    formData.append("tid", user.tid);
    formData.append("kind", competitionKind);
    formData.append("type", competitionType);
    formData.append("title", title);
    formData.append("contents", "");
    formData.append("region", address[0].name);
    formData.append("limit_team", teamLength);
    formData.append("person_vs", numberPlayers);
    formData.append("regist_sdate", new Date());
    formData.append("event_sdate", startDate);
    formData.append("event_edate", endDate);
    formData.append("frequency", frequencyGame);
    formData.append("yoil", weekDate.join(","));
    formData.append("files[]", file);

    sendPost(
      "/api/competitions",
      formData,
      res => {
        toast("경기가 생성되었습니다");
        router.back();
      },
      () => {},
      REQUEST_HEADER_CONTENTS_FORM
    );
  };

  const competitionName = competitionType === 1 ? "리그" : "컵";

  return (
    <>
      <PrevHeader>
        <div type={"right"}>
          <Button
            variant={"text"}
            className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray7`}
            disabled={!formClear}
            onClick={createCompetition}>
            완료
          </Button>
        </div>
      </PrevHeader>
      <main className={`pb-[60px]`}>
        <Form>
          <UploadCover file={file} setFile={setFile}></UploadCover>
          <div className={`inner`}>
            <Form.Group>
              <Form.Control
                as={`textarea`}
                placeholder={`${competitionName} 이름을 입력해주세요. (최대 30자)`}
                value={title}
                rows={1}
                onChange={e => setTitle(e.target.value)}
                className={`p-0 border-0 rounded-0 text-[14px] my-[20px] !min-h-fit`}></Form.Control>
            </Form.Group>
          </div>
          <hr className={`hr-line`} />
          <ul className={`inner`}>
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
            <EditItemSelect
              placeholder={`인원 선택`}
              title={`경기 인원`}
              value={numberPlayers}
              setValue={setNumberPlayers}
              list={numberPlayersList()}></EditItemSelect>
            <EditItemDateSelect
              placeholder={`날짜 선택`}
              title={`경기 시작 희망일`}
              value={startDate}
              setValue={setStartDate}></EditItemDateSelect>
            <EditItemDateSelect
              placeholder={`날짜 선택`}
              title={`경기 마감일`}
              value={endDate}
              setValue={setEndDate}></EditItemDateSelect>
            <EditItemSelect
              placeholder={`빈도 선택`}
              title={`경기 빈도`}
              value={frequencyGame}
              setValue={setFrequencyGame}
              list={frequencyGameList()}></EditItemSelect>
            <EditItemWeekSelect
              title={`희망 요일`}
              value={weekDate}
              setValue={setWeekDate}
              style={`!border-none`}></EditItemWeekSelect>
          </ul>
          {competitionType === 1 && (
            <div className={`mt-[44px] text-gray7 text-[13px] inner`}>
              <h4 className={`font-bold`}>리그 형식</h4>
              <ul className={`mt-[5px] flex flex-column `}>
                <li className={`left-dot`}>단일 대결</li>
                <li className={`left-dot`}>
                  승리당 점수 +3 / 무승부당 점수 +1 / 패배당 점수 +0
                </li>
              </ul>
            </div>
          )}
        </Form>
      </main>
    </>
  );
}
