import { useState, useEffect } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import AreaSelect from "@/components/team/AreaSelect";
import { toast } from "react-toastify";
import { sendGet, sendPost } from "@/helper/api";
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
import { printDateTimeFormat } from "@/helper/value";

export default function Index() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState([]);
  const [teamLength, setTeamLength] = useState("");
  const [competitionKind, setCompetitionKind] = useState("");
  const [competitionType, setCompetitionType] = useState("");
  const [numberPlayers, setNumberPlayers] = useState("");
  const [frequencyGame, setFrequencyGame] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [registEndDate, setRegistEndDate] = useState("");
  const [weekDate, setWeekDate] = useState([]);
  const [formClear, setFormClear] = useState(false);
  const router = useRouter();
  const user = useSelector(state => state.user);
  const competitionId = router.query.id;

  const getCompetition = function () {
    sendGet(`/api/competitions/detail/${competitionId}`, null, res => {
      const data = res.data.result;
      const yoilArr = data.yoil?.split(",").map(Number);

      setFile(data.file_path);
      setTitle(data.title);
      setAddress(data.region);
      setTeamLength(data.limit_team);
      setCompetitionKind(data.kind);
      setCompetitionType(Number(data.type));
      setNumberPlayers(data.person_vs);
      setFrequencyGame(data.frequency);
      setEventStartDate(printDateTimeFormat(data.event_sdate, "YYYY-MM-dd"));
      setEventEndDate(printDateTimeFormat(data.event_edate, "YYYY-MM-dd"));
      setRegistEndDate(printDateTimeFormat(data.regist_edate, "YYYY-MM-dd"));
      setWeekDate(yoilArr);
    });
  };

  useEffect(() => {
    if (!competitionId) return;
    getCompetition();
  }, [competitionId]);

  useEffect(() => {
    if (!eventStartDate || !eventEndDate) return;

    if (eventEndDate < eventStartDate) {
      toast("경기 마감일은 희망일보다 늦어야 합니다.");
      setEventEndDate("");
    }
  }, [eventStartDate, eventEndDate]);

  useEffect(() => {
    if (!registEndDate || !eventStartDate) return;

    if (eventStartDate < registEndDate) {
      toast("모집 마감일은 경기 시작 희망일보다 빨라야 합니다.");
      setRegistEndDate("");
    }
  }, [eventStartDate, registEndDate]);

  useEffect(() => {
    if (!title || !file || !address) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [title, file, address]);

  const editCompetition = () => {
    const formData = new FormData();
    formData.append("tid", user.tid);
    formData.append("kind", competitionKind);
    formData.append("type", competitionType);
    formData.append("title", title);
    formData.append("contents", "");
    formData.append("region", address[0].name);
    formData.append("limit_team", teamLength);
    formData.append("person_vs", numberPlayers);
    formData.append("regist_edate", registEndDate);
    formData.append("event_sdate", eventStartDate);
    formData.append("event_edate", eventEndDate);
    formData.append("frequency", frequencyGame);
    formData.append("yoil", weekDate.join(","));
    formData.append("files[]", file);

    sendPost(
      `/api/competitions/${competitionId}`,
      formData,
      res => {
        toast("대회가 수정되었습니다.");
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
            onClick={editCompetition}>
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
                placeholder={`리그 이름을 입력해주세요. (최대 30자)`}
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
              value={eventStartDate}
              setValue={setEventStartDate}></EditItemDateSelect>
            <EditItemDateSelect
              placeholder={`날짜 선택`}
              title={`경기 마감일`}
              value={eventEndDate}
              setValue={setEventEndDate}></EditItemDateSelect>
            <EditItemDateSelect
              placeholder={`날짜 선택`}
              title={`모집 마감일`}
              value={registEndDate}
              setValue={setRegistEndDate}></EditItemDateSelect>
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
          <div className={`mt-[60px] text-gray7 text-[13px] inner`}>
            <h4 className={`font-bold`}>리그 형식</h4>
            <ul className={`mt-[5px] flex flex-column `}>
              <li className={`left-dot`}>단일 대결</li>
              <li className={`left-dot`}>
                승리당 점수 +3 / 무승부당 점수 +1 / 패배당 점수 +0
              </li>
            </ul>
          </div>
        </Form>
      </main>
    </>
  );
}
