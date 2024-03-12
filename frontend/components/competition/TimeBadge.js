import { useEffect, useState } from "react";
import TimeIcon from "@/public/icons/system/time-line.svg";

export default function TimeBadge({ matchInfo }) {
  const [isEnd, setIsEnd] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [isGardeningImminent, setIsGardeningImminent] = useState(false); //임박
  const [eventDDay, setEventDDay] = useState(0);

  useEffect(() => {
    if (!matchInfo) return;

    const today = new Date();

    setIsEnd(new Date(matchInfo.event_edate) < today);
    setIsProgress(
      new Date(matchInfo.event_sdate) < today ||
        Number(matchInfo.limit_team) === Number(matchInfo.team_count)
    );
    setIsGardeningImminent(
      Number(matchInfo.limit_team) - 1 === Number(matchInfo.team_count)
    );

    const milliseconds = new Date(matchInfo.event_sdate) - today;
    const days = Math.ceil(milliseconds / (24 * 60 * 60 * 1000));

    setEventDDay(days);
  }, [matchInfo]);

  function TimeBlock({ text, color }) {
    return (
      <div className={`flex gap-[3px] align-items-center ${color}`}>
        <TimeIcon width={15}></TimeIcon>
        <p className={`text-[13px] font-bold`}>{text}</p>
      </div>
    );
  }

  return (
    <>
      {isEnd ? (
        <TimeBlock text={`대회종료`} color={`text-gray8`} />
      ) : isProgress ? (
        //진행
        <TimeBlock text={`진행중`} color={`text-blue_primary`} />
      ) : isGardeningImminent ? (
        <TimeBlock text={`모집중 D-${eventDDay}`} color={`text-red_primary`} />
      ) : (
        <TimeBlock text={`모집중 D-${eventDDay}`} color={`text-green_primary`} />
      )}
    </>
  );
}
