import RoundProfile from "@/components/image/RoundProfile";
import ScoreSelect from "@/components/competition/ScoreSelect";
import { useEffect, useState } from "react";

export default function RoundItem({ item }) {
  const [showModal, setShowModal] = useState(false);
  const [nowItem, setNowItem] = useState(null);

  useEffect(() => {
    if (!showModal) {
      setNowItem(null);
    }
  }, [showModal]);

  const selectScore = item => {
    setShowModal(true);
    setNowItem(item);
  };

  return (
    <>
      <div>
        <span
          className={`text-[15px] text-gray9 w-[86px] h-[30px] flex align-items-center justify-center rounded-full bg-gray1 mx-auto my-[22px]`}>
          {item.round}라운드
        </span>
        <ul className={`flex flex-column gap-[20px]`}>
          {item.list.map(match => {
            return (
              <li
                className={`border-[1px] rounded-[3px] py-[18px] px-[24px] flex justify-between !border-gray4`}
                key={match.sid}>
                <div className={`flex flex-column gap-[6px] align-items-center w-[92px]`}>
                  <RoundProfile size={46}></RoundProfile>
                  <p className={`text-[13px] text-gray10 font-bold`}>{match.title1}</p>
                </div>
                <div
                  className={`w-full flex flex-column gap-[8px] justify-content-center`}>
                  <p className={`text-[13px] text-center`}>정해진 날짜 없음</p>
                  <div
                    className={`flex align-items-center text-[24px] w-[90px] mx-auto border-[1px] !border-gray3 rounded-[3px] h-[42px] text-gray6`}
                    onClick={() => selectScore(match)}>
                    <p className={`w-full text-right`}>-</p>
                    <p className={`w-[18px]`}>:</p>
                    <p className={`w-full text-left`}>-</p>
                  </div>
                </div>
                <div className={`flex flex-column gap-[6px] align-items-center w-[92px]`}>
                  <RoundProfile size={46}></RoundProfile>
                  <p className={`text-[13px] text-gray10 font-bold`}>
                    {match["title2 "]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <ScoreSelect show={showModal} setShow={setShowModal} item={nowItem}></ScoreSelect>
    </>
  );
}