import RoundProfile from "@/components/image/RoundProfile";
import React from "react";

export default function MatchItem({ match }) {
  const resultScore = 1;

  return (
    <div
      className={`py-[14px] border-[1px] !border-gray4 rounded-[3px] position-relative`}>
      <p className={`text-[13px] text-center font-bold mb-[8px]`}>{match.title}</p>
      <ul className={`flex items-center text-[14px]`}>
        <li className={`flex items-center gap-[10px] justify-end w-full`}>
          {match.title1}
          <RoundProfile size={30} img={match.t1_thum}></RoundProfile>
        </li>
        <li className={`text-[24px] flex items-center font-bold`}>
          <span className={`w-[30px] text-end`}>1</span>
          <span className={`w-[18px] text-center`}>:</span>
          <span className={`w-[30px]`}>0</span>
        </li>
        <li className={`flex items-center gap-[10px] w-full`}>
          <RoundProfile size={30} img={match.t2_thum}></RoundProfile>
          {match.title2}
        </li>
      </ul>
      <p className={`text-center text-gray8 text-[13px] mt-[8px]`}>
        03월 04일(토) 오전 10:00
      </p>
      <div
        className={`position-absolute left-[6px] top-[6px] w-[28px] h-[28px] flex items-center justify-center text-[13px] font-bold rounded-[3px] ${
          resultScore === 1
            ? "bg-blue_sub text-blue_primary"
            : resultScore === 2
              ? "bg-red_sub text-red_primary"
              : "bg-gray4 text-gray9"
        }`}>
        {resultScore === 1 ? "승" : resultScore === 2 ? "패" : "무"}
      </div>
    </div>
  );
}
