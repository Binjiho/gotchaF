import RoundProfile from "@/components/image/RoundProfile";
import React from "react";
import { useRouter } from "next/router";
import { printDateTimeFormat } from "@/helper/value";

export default function MyCompetition({ match }) {
  const router = useRouter();

  const goDetailPage = () => {
    router.push(`/competition/${match.sid}`);
  };

  return (
    <div onClick={goDetailPage} className={`w-full bg-gray1 rounded-[5px] relative`}>
      <div
        className={`w-[41px] h-[28px] rounded-[3px] text-white text-[13px] font-bold absolute left-[6px] top-[6px] bg-red_primary flex items-center justify-center`}>
        D-3
      </div>
      <div className={`py-[14px]`}>
        <p className={`text-[13px] text-center font-bold mb-[8px]`}>
          {printDateTimeFormat(match.matched_at, "M월 d일(E) AA hh:mm")}
        </p>
        <ul className={`flex items-center text-[14px]`}>
          <li className={`flex items-center gap-[10px] justify-end w-full font-medium`}>
            {match.title1}
            <RoundProfile size={30} img={match.t1_thum}></RoundProfile>
          </li>
          <li className={`text-[25px] mx-[10px] font-semibold`}>VS</li>
          <li className={`flex items-center gap-[10px] w-full font-medium`}>
            <RoundProfile size={30} img={match.t2_thum}></RoundProfile>
            {match.title2}
          </li>
        </ul>
        <p className={`text-[13px] text-center mt-[8px] text-gray8`}>{match.title}</p>
      </div>
    </div>
  );
}
