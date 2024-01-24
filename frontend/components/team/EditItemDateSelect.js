import React, { useRef, useId } from "react";
import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";

export default function EditItemDateSelect({
  placeholder,
  title,
  value,
  setValue,
  style = "",
}) {
  const inputRef = useRef();
  const id = useId();

  const changeValue = e => {
    setValue(e.target.value);
  };

  const onRefClick = e => {
    inputRef.current.showPicker();
  };

  return (
    <div
      className={`flex justify-between align-items-center py-[16px] border-b-[1px] border-gray3 text-gray10 ${style}`}>
      <p className={`text-[15px] gap-[4px]`}>{title}</p>
      <div className={`date-input-hide`}>
        <input type="date" ref={inputRef} value={value} onChange={changeValue} id={id} />
        <label
          className={`flex cursor-pointer relative  ${
            value ? "text-black" : "text-gray7 "
          }`}
          onClick={onRefClick}
          htmlFor={id}>
          {value ? value : placeholder}
          <RightIcon width={24} className={`text-gray6`}></RightIcon>
        </label>
      </div>
    </div>
  );
}
