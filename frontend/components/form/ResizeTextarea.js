import React, { useLayoutEffect, useRef } from "react";
import { Form } from "react-bootstrap";

export default function ResizeTextarea({
  placeholder = "내용을 입력해주세요",
  value,
  setValue,
  className = "",
}) {
  const textbox = useRef(null);

  function adjustHeight() {
    textbox.current.style.height = "inherit";
    textbox.current.style.height = `${textbox.current.scrollHeight}px`;
  }

  useLayoutEffect(adjustHeight, []);

  function handleKeyDown(e) {
    setValue(e.target.value);
    adjustHeight();
  }

  return (
    <Form.Control
      as={`textarea`}
      placeholder={`내용을 입력해주세요`}
      value={value}
      ref={textbox}
      rows={1}
      onChange={handleKeyDown}
      className={`!min-h-0 ${className}`}></Form.Control>
  );
}
