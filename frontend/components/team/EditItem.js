import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";
import { Button } from "react-bootstrap";

export default function EditItem({ placeholder, title, onButtonClick }) {
  return (
    <li
      className={
        "flex justify-between align-items-center py-[17px] border-b-[1px] border-gray3"
      }>
      <p className={`text-[15px] text-gray10 gap-[4px]`}>{title}</p>
      <Button variant={"text"} className={`flex`} onClick={onButtonClick}>
        <p className={`text-gray7 text-[15px]`}>{placeholder}</p>
        <RightIcon width={24} className={`text-gray6`}></RightIcon>
      </Button>
    </li>
  );
}
