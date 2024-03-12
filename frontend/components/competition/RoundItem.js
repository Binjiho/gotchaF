import RoundProfile from "@/components/image/RoundProfile";
import ScoreSelect from "@/components/competition/ScoreSelect";
import React, { useEffect, useId, useRef, useState } from "react";
import { printDateTimeFormat } from "@/helper/value";
import { sendPost } from "@/helper/api";
import { toast } from "react-toastify";

export default function RoundItem({ item, changeRound }) {
  const [showModal, setShowModal] = useState(false);
  const [nowItem, setNowItem] = useState(null);
  const inputRef = useRef({});
  const id = useId();

  useEffect(() => {
    if (!showModal) {
      setNowItem(null);
    }
  }, [showModal]);

  const selectScore = item => {
    setShowModal(true);
    setNowItem(item);
  };

  const changeValue = (value, match) => {
    createDate(value, match);
  };

  const onRefClick = i => {
    inputRef.current[i].showPicker();
  };

  const createDate = (date, match) => {
    const data = {
      matched_at: date,
    };

    sendPost(
      `/api/matches/score/${match.sid}`,
      data,
      res => {
        changeRound();
        toast("날짜가 변경되었습니다.");
      },
      err => {
        toast("날짜 변경에 실패했습니다.");
      }
    );
  };

  return (
    <>
      <div>
        <span
          className={`text-[15px] text-gray9 w-[86px] h-[30px] flex align-items-center justify-center rounded-full bg-gray1 mx-auto mb-[22px]`}>
          {item.round}라운드
        </span>
        <ul className={`flex flex-column gap-[20px]`}>
          {item.list.map((match, i) => {
            return (
              <li
                className={`border-[1px] rounded-[3px] py-[18px] px-[24px] flex justify-between !border-gray4`}
                key={match.sid}>
                <div className={`flex flex-column gap-[6px] align-items-center w-full`}>
                  <RoundProfile size={46} img={match.thum1}></RoundProfile>
                  <p className={`text-[13px] text-gray10 font-bold`}>{match.title1}</p>
                </div>
                <div
                  className={`w-[116px] flex flex-column gap-[8px] justify-content-center`}>
                  <div className={`date-input-hide`}>
                    <input
                      type="date"
                      ref={e => (inputRef.current[i] = e)}
                      value={
                        match.matched_at
                          ? printDateTimeFormat(match.matched_at, "YYYY-MM-dd")
                          : ""
                      }
                      onChange={e => changeValue(e.target.value, match)}
                      id={id}
                    />
                    <label
                      className={`text-[13px] relative text-center mx-auto block cursor-pointer ${
                        match.matched_at ? "text-black" : "text-gray7 "
                      }`}
                      onClick={() => onRefClick(i)}
                      htmlFor={id}>
                      {match.matched_at
                        ? printDateTimeFormat(match.matched_at, "YYYY-MM-dd")
                        : "정해진 날짜 없음"}
                    </label>
                  </div>
                  <div
                    className={`flex align-items-center text-[24px] w-[90px] mx-auto border-[1px] !border-gray3 rounded-[3px] h-[42px] cursor-pointer font-black ${
                      match.matched_at ? "text-black" : "text-gray6"
                    }`}
                    onClick={() => selectScore(match)}>
                    <p className={`w-full text-right`}>
                      {match.matched_at ? match.t1_score : "-"}
                    </p>
                    <p className={`w-[18px] flex-[0_0_18px] text-center`}>:</p>
                    <p className={`w-full text-left`}>
                      {match.matched_at ? match.t2_score : "-"}
                    </p>
                  </div>
                </div>
                <div className={`flex flex-column gap-[6px] align-items-center w-full`}>
                  <RoundProfile size={46} img={match.thum2}></RoundProfile>
                  <p className={`text-[13px] text-gray10 font-bold`}>{match.title2}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <ScoreSelect
        show={showModal}
        setShow={setShowModal}
        item={nowItem}
        changeScore={changeRound}></ScoreSelect>
    </>
  );
}
