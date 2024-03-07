import { Form } from "react-bootstrap";
import { useRef } from "react";

export default function CommonSelect({ value, setValue, list = [], size = 40 }) {
  const ref = useRef();

  const changeValue = e => {
    setValue(e.target.value);
  };

  return (
    <Form.Select
      className={`!border-gray4 ${value ? "text-black" : "text-gray7 "}`}
      value={value}
      onChange={changeValue}
      size={size}>
      <option value={""}>선택해주세요</option>
      {list?.map(item => {
        return (
          <option key={`${ref}-` + item.value} value={item.value}>
            {item.name}
          </option>
        );
      })}
    </Form.Select>
  );
}
