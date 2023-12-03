import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";
import { Button } from "react-bootstrap";

export default function EditItem({ placeholder, title, onButtonClick, value }) {
  return (
    <li
      className={
        "flex justify-between align-items-center py-[16px] border-b-[1px] border-gray3"
      }>
      <p className={`text-[15px] text-gray10 gap-[4px]`}>{title}</p>
      <Button variant={"text"} className={`flex`} onClick={onButtonClick}>
        <div className={`text-[15px]`}>
          {value ? <p>{value}</p> : <p className={`text-gray7`}>{placeholder}</p>}
        </div>
        <RightIcon width={24} className={`text-gray6`}></RightIcon>
      </Button>
    </li>
  );
}
