import { Button } from "react-bootstrap";
import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";

export default function LinkHeader({ title, active = null, className = "" }) {
  return (
    <div className={`flex justify-between align-items-center ${className}`}>
      <h3 className={`text-gray10 text-[18px] font-bold`}>{title}</h3>
      {active && (
        <Button variant={`text`} onClick={active}>
          <RightIcon className={`w-[18px] text-[#A2A6A9]`} />
        </Button>
      )}
    </div>
  );
}
