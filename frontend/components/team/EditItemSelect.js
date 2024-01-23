import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";
import { Button } from "react-bootstrap";

export default function EditItemSelect({
  placeholder,
  title,
  value,
  setValue,
  style = "",
  list = [],
}) {
  const changeValue = e => {
    setValue(e.target.value);
  };

  return (
    <div
      className={`flex justify-between align-items-center py-[16px] border-b-[1px] border-gray3 text-gray10 ${style}`}>
      <p className={`text-[15px] gap-[4px]`}>{title}</p>
      <div className={`flex cursor-pointer relative`}>
        <select
          name=""
          id=""
          value={value}
          onChange={changeValue}
          className={`border-none p-0 focus:ring-0 focus:ring-offset-0 cursor-pointer text-end bg-right-arrow absolute right-0 !pr-[23px] bg-none bg-transparent ${
            value ? "text-black" : "text-gray7 "
          }`}
          dir={"rtl"}>
          <option value={""}>{placeholder}</option>
          {list.map(item => {
            return (
              <option key={"list-" + item.value} value={item.value}>
                {item.name}
              </option>
            );
          })}
        </select>
        <RightIcon width={24} className={`text-gray6`}></RightIcon>
      </div>
    </div>
  );
}
