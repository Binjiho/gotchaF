import { Badge } from "react-bootstrap";
import { calculateAge, printDateTimeFormat } from "@/helper/value";
import { useEffect, useState } from "react";
import TimeBadge from "@/components/competition/TimeBadge";
import TimeIcon from "@/public/icons/system/time-line.svg";
import { COMPETITION_KIND } from "@/constants/serviceConstants";

export default function CompetitionItem({ item }) {
  const [isProgress, setIsProgress] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  const parseDaysString = function (daysString) {
    // 주어진 문자열을 쉼표로 분리하여 배열로 만듭니다.
    const daysArray = daysString.split(",");

    // 일, 월, 화 등의 문자열을 각각의 요일로 매핑하는 객체를 생성합니다.
    const daysMapping = {
      "0": "일",
      "1": "월",
      "2": "화",
      "3": "수",
      "4": "목",
      "5": "금",
      "6": "토",
    };

    // 각각의 숫자를 해당하는 요일 문자열로 변환하고, 새로운 배열에 담습니다.
    const convertedDaysArray = daysArray.map(dayNumber => daysMapping[dayNumber]);

    // 최종 결과를 콤마로 구분하여 반환합니다.
    return convertedDaysArray.join(", ");
  };

  useEffect(() => {
    setIsEnd(new Date(item.event_edate) < new Date());
    setIsProgress(
      new Date(item.event_sdate) < new Date() ||
        Number(item.limit_team) === Number(item.team_count)
    );
  }, [item]);

  function TimeBlock({ text, color }) {
    return (
      <div className={`flex gap-[3px] align-items-center ${color}`}>
        <TimeIcon width={15}></TimeIcon>
        <p className={`text-[13px] font-bold`}>{text}</p>
      </div>
    );
  }

  return (
    <div className={`border-b !border-b-gray4 py-[22px]`}>
      <div className={`flex gap-[5px]`}>
        <Badge pill bg="secondary" size={12}>
          {item.region}
        </Badge>
        <Badge pill bg="secondary" size={12}>
          {COMPETITION_KIND[item.kind]}
        </Badge>
        <Badge pill bg="secondary">
          {item.person_vs}
        </Badge>
        <div className={`ml-auto`}>
          <TimeBadge
            eventStart={item.event_sdate}
            eventEnd={item.event_edate}
            limit={item.limit_team}
            teamCount={item.team_count}></TimeBadge>
        </div>
      </div>
      <div className={`mt-[12px] flex gap-[20px]`}>
        <div className={`w-full`}>
          <h3 className={`text-[15px]`}>{item.title}</h3>
          <p
            className={`text-[14px] text-gray9 mt-[8px] flex align-items-center gap-[3px] `}>
            <span>{printDateTimeFormat(item.event_sdate, "M.d(E)")} 시작</span>
            <span className={`gap-dot`}></span>
            <span>
              {item.frequency} {parseDaysString(item.yoil)}
            </span>
          </p>
          <p className={`text-[14px] text-gray10 font-medium`}>
            {!isEnd ? (
              <>
                <span>{item.limit_team}팀 모집 중 </span>
                <span className={`text-green_primary`}>{item.team_count}팀 참가중</span>
              </>
            ) : (
              <span>{item.team_count}팀 참가</span>
            )}
          </p>
        </div>
        <div className={`w-[80px] h-[75px] bg-gray1 rounded-[5px] flex-[0_0_80px]`}>
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
}
