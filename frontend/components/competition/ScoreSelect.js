import BottomSheetModal from "@/components/modal/BottomSheetModal";
import { useEffect, useState } from "react";
import NumberSelect from "@/components/form/NumberSelect";
import { Button } from "react-bootstrap";
import { sendPost } from "@/helper/api";
import { printDateTimeFormat } from "@/helper/value";

export default function ScoreSelect({ show, setShow, item }) {
  const [teamScore1, setTeamScore1] = useState(0);
  const [teamScore2, setTeamScore2] = useState(0);

  useEffect(() => {
    if (teamScore1 < 0) {
      setTeamScore1(0);
    }

    if (teamScore2 < 0) {
      setTeamScore2(0);
    }
  }, [teamScore1, teamScore2]);

  const createScore = () => {
    const data = {
      t1_score: teamScore1,
      t2_score: teamScore2,
      matched_at: printDateTimeFormat(new Date(), "YYYY-MM-dd HH:mm"),
      state: "Y",
    };

    sendPost(
      `/api/matches/score/${item.sid}`,
      data,
      res => {
        console.log(res);
      },
      () => {}
    );
  };

  return (
    <>
      <BottomSheetModal show={show} setShow={setShow}>
        <p type={`left`}>점수입력</p>
        {item && (
          <div type={`content`}>
            <ul
              className={`px-[20px] flex flex-column [&_li]:flex [&_li]:items-center [&_li]:justify-between gap-[26px] pt-[20px] pb-[40px] `}>
              <li>
                <span>{item.title1}</span>
                <NumberSelect score={teamScore1} setScore={setTeamScore1}></NumberSelect>
              </li>
              <li>
                <span>{item["title2 "]}</span>
                <NumberSelect score={teamScore2} setScore={setTeamScore2}></NumberSelect>
              </li>
            </ul>
            <div className={`shadow-[0_-2px_6px_0_rgba(0,0,0,0.04)] px-[20px] py-[12px]`}>
              <Button
                className={`w-full`}
                variant="green-primary"
                size="50"
                onClick={createScore}>
                점수 입력
              </Button>
            </div>
          </div>
        )}
      </BottomSheetModal>
    </>
  );
}
