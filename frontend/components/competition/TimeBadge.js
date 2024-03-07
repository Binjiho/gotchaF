import { useEffect, useState } from "react";
import TimeIcon from "@/public/icons/system/time-line.svg";

export default function TimeBadge({ eventStart, eventEnd, limit, teamCount }) {
  const [isEnd, setIsEnd] = useState(false);
  const [isProgress, setIsProgress] = useState(false);
  const [isGardeningImminent, setIsGardeningImminent] = useState(false);
  const [eventDDay, setEventDDay] = useState(0);

  useEffect(() => {
    setIsEnd(new Date(eventEnd) < new Date());
    setIsProgress(
      new Date(eventStart) < new Date() || Number(limit) === Number(teamCount)
    );
    setIsGardeningImminent(Number(limit) - 1 === Number(teamCount));

    const milliseconds = new Date(eventStart) - new Date();
    const days = Math.ceil(milliseconds / (24 * 60 * 60 * 1000));

    setEventDDay(days);
  }, [eventStart, eventEnd, limit, teamCount]);

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
