import RoundProfile from "@/components/image/RoundProfile";
import React from "react";
import { printDateTimeFormat } from "@/helper/value";
import { printDday } from "@/helper/UIHelper";
import CalendarIcon from "@/public/icons/social/calendar.svg";
import UserLineIcon from "@/public/icons/social/map-pin-user-line.svg";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { sendPost } from "@/helper/api";
import { toast } from "react-toastify";

export default function MatchScheduleItem({ match }) {
  const router = useRouter();
  const user = useSelector(state => state.user);
  const teamId = router.query.id;

  const isMyTeam = Number(user?.tid) === Number(teamId);

  const goDetailPage = () => {
    router.push(`/competition/${match.sid}`);
  };

  const joinCompetition = e => {
    e.stopPropagation();

    sendPost(`/api/competitions/apply/${match.sid}`, null, res => {
      if (res.data?.result?.sid) {
        toast("참가 신청이 되었습니다.");
      }
    });
  };

  return (
    <div onClick={goDetailPage} className={`w-full`}>
      <div
        className={
          "bg-gray2 rounded-[3px] py-[8px] px-[14px] text-[15px] font-medium flex justify-between items-center"
        }>
        <p className={`text-gray9`}>
          {printDateTimeFormat(match.matched_at, "M월 d일(E)")}
        </p>
        <p className={`text-red_primary`}>{printDday(match.matched_at)}</p>
      </div>
      <div className={`py-[18px]`}>
        <p className={`text-[13px] text-center font-bold mb-[8px]`}>{match.title}</p>
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
      </div>
      <div
        className={
          "bg-gray2 rounded-[3px] py-[15px] px-[14px] text-[14px] flex justify-between items-center text-gray9"
        }>
        <ul className={`flex flex-column gap-[4px]`}>
          <li className={`flex items-center`}>
            <CalendarIcon width={15} className={`mr-[8px]`} />
            <span>{printDateTimeFormat(match.matched_at, "M.d E")}</span>
            <span className={`gap-line mx-[4px]`}></span>
            <span>{printDateTimeFormat(match.matched_at, "Aa HH:mm")}</span>
          </li>
          <li className={`flex items-center`}>
            <UserLineIcon width={15} className={`mr-[8px]`} />
            <span>{match.match_user_cnt}명 참여중</span>
          </li>
        </ul>
        {isMyTeam && (
          <Button
            variant="white"
            className={`w-[83px] !flex-[0_0_83px] !h-[38px] text-[14px] font-bold`}
            onClick={joinCompetition}>
            참여하기
          </Button>
        )}
      </div>
    </div>
  );
}
