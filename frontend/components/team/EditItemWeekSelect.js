import React, { useId } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { weekList } from "@/constants/UiConstants";

export default function EditItemWeekSelect({ title, value, setValue, style = "" }) {
  const changeValue = v => {
    setValue(v);
  };

  const id = useId();

  return (
    <div
      className={`flex justify-between align-items-center py-[16px] border-b-[1px] border-gray3 text-gray10 ${style}`}>
      <p className={`text-[15px] gap-[4px]`}>{title}</p>
      <ToggleButtonGroup
        type="checkbox"
        value={value}
        onChange={changeValue}
        className="round-btn">
        {weekList.map(item => {
          return (
            <ToggleButton
              id={`${id}-${item.value}`}
              value={item.value}
              key={`week-btn-${item.value}`}>
              {item.name}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
}
