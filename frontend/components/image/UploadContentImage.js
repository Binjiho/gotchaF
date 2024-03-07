import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Image from "@/public/icons/tool/image.svg";
import Camera from "@/public/icons/tool/camera.svg";

export default function UploadContentImage({ file, setFile }) {
  const [image, setImage] = useState("");

  function handleChange(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    if (typeof file === "string") {
      setImage(file);
    }
  }, [file]);

  return (
    <>
      <Form.Group
        controlId="formImage"
        className={`w-full h-[52px] flex align-items-center position-fixed bottom-0 border-t-[1px] !border-t-gray1 left-[50%] translate-x-[-50%] px-[20px] bg-white max-w-layout`}>
        <Form.Label>
          <Camera width={`26px`} className={`cursor-pointer`}></Camera>
        </Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleChange}
          className={`hidden`}
        />
      </Form.Group>
      {file && (
        <div className={`w-full`}>
          <img src={image} className={`w-full`} />
        </div>
      )}
    </>
  );
}
