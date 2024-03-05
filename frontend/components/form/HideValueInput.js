import { Form, InputGroup } from "react-bootstrap";
import ShowIcon from "@/public/icons/tool/show.svg";
import HideIcon from "@/public/icons/tool/hide.svg";
import DeleteIcon from "@/public/icons/system/close-circle-delete.svg";
import { useState } from "react";

export default function HideValueInput({ value, setValue, placeholder }) {
  const [isShow, setIsShow] = useState(false);

  return (
    <InputGroup>
      <Form.Control
        type={isShow ? "text" : "password"}
        className={`height-50`}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <InputGroup.Text className={`flex gap-[22px]`}>
        {value && (
          <>
            <DeleteIcon
              width={24}
              className={`cursor-pointer`}
              onClick={() => setValue("")}
            />
            {isShow ? (
              <HideIcon
                width={24}
                className={`cursor-pointer`}
                onClick={() => setIsShow(false)}
              />
            ) : (
              <ShowIcon
                width={24}
                className={`cursor-pointer`}
                onClick={() => setIsShow(true)}
              />
            )}
          </>
        )}
      </InputGroup.Text>
    </InputGroup>
  );
}
