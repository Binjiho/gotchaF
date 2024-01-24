import React, { useId } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

export default function EditItemWeekSelect({ title, value, setValue, style = "" }) {
  const weekList = [
    {
      value: 1,
      name: "월",
    },
    {
      value: 2,
      name: "화",
    },
    {
      value: 3,
      name: "수",
    },
    {
      value: 4,
      name: "목",
    },
    {
      value: 5,
      name: "금",
    },
    {
      value: 6,
      name: "토",
    },
    {
      value: 7,
      name: "일",
    },
  ];

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
