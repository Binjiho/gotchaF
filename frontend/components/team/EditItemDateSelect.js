import React, { useEffect, useRef, useId } from "react";
import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";

export default function EditItemDateSelect({
  placeholder,
  title,
  value,
  setValue,
  style = "",
}) {
  const inputRef = useRef();

  const changeValue = e => {
    setValue(e.target.value);
  };

  const onRefClick = e => {
    interviewDateRef.current.focus();
  };

  return (
    <div
      className={`flex justify-between align-items-center py-[16px] border-b-[1px] border-gray3 text-gray10 ${style}`}>
      <p className={`text-[15px] gap-[4px]`}>{title}</p>
      <input
        type="date"
        id={inputRef}
        // value={value}
        // onChange={changeValue}
        // className={`invisible`}
      />
      <label className={`flex cursor-pointer relative`} onClick={onRefClick}>
        {value}555
        <RightIcon width={24} className={`text-gray6`}></RightIcon>
      </label>
    </div>
  );
}
