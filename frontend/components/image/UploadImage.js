import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Image from "@/public/icons/tool/image.svg";
import Camera from "@/public/icons/tool/camera.svg";

export default function UploadImage({ file, setFile }) {
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
      {!file && (
        <Form.Group
          controlId="formImage"
          className={`w-[100px] h-[100px] bg-gray3 rounded-[3px]`}>
          <Form.Label
            className={`w-full h-full flex flex-column align-items-center justify-center text-gray7 mb-0 cursor-pointer`}>
            <Image width={`32px`} className={`text-gray6`}></Image>
            <span className={`text-[14px] mt-[2px]`}>사진 추가</span>
          </Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleChange}
            className={`hidden`}
          />
        </Form.Group>
      )}
      {file && (
        <div
          className={`w-[100px] h-[100px] bg-gray3 rounded-[3px] overflow-hidden relative`}>
          <img src={image} className={`object-cover w-full h-full`} />
          <Form.Group
            controlId="formImage"
            className={`absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`}>
            <Form.Label
              className={`w-[36px] h-[36px] bg-black bg-opacity-50 rounded-full text-white flex align-items-center justify-center mb-0`}>
              <Camera width={`18px`} className={`text-gray6`}></Camera>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleChange}
              className={`hidden`}
            />
          </Form.Group>
        </div>
      )}
    </>
  );
}
