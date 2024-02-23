import { Button } from "react-bootstrap";
import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";

export default function LinkHeader({ title, active = null, className = "" }) {
  return (
    <div className={`flex justify-between align-items-center inner ${className}`}>
      <h3 className={`text-gray10 text-[18px] font-bold`}>{title}</h3>
      {active && (
        <Button
          variant={`text`}
          onClick={active}
          className={`flex text-[#A2A6A9] text-[12px] items-center`}>
          전체보기
          <RightIcon className={`w-[18px]`} />
        </Button>
      )}
    </div>
  );
}
