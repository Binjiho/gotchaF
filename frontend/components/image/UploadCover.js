import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Image from "@/public/icons/tool/image.svg";
import Camera from "@/public/icons/tool/camera.svg";

export default function UploadCover({ file, setFile }) {
  const [image, setImage] = useState("");

  function handleChange(e) {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  }

  return (
    <>
      {!file && (
        <div className={`w-[100%] h-[154px] relative`}>
          <Form.Group
            controlId="formImage"
            className={`w-[100vw] h-[100%] max-w-layout bg-gray5 rounded-[3px]`}>
            <Form.Label
              className={`w-full h-full flex flex-column align-items-center justify-center text-gray8 mb-0`}>
              <Image width={`26px`} className={`text-gray7`}></Image>
              <span className={`text-[13px]`}>커버 사진 추가</span>
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
      {file && (
        <div className={`w-[100%] h-[154px] relative`}>
          <div className={`w-[100vw] h-[100%] max-w-layout bg-gray5 rounded-[3px] `}>
            <img src={image} className={`w-[100%] h-[100%] object-cover`} />
          </div>
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
