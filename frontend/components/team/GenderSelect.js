import EditItem from "@/components/team/EditItem";
import { useState, useEffect } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import { SEX_TYPE } from "@/constants/serviceConstants";

export default function GenderSelect({ genderType, setGenderType }) {
  const [showModal, setShowModal] = useState(false);
  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (!genderType) return;
    handleClose();
  }, [genderType]);

  return (
    <>
      <EditItem
        placeholder={`성별 선택`}
        title={`성별`}
        value={genderType ? SEX_TYPE[genderType] : null}
        onButtonClick={handleButtonClick}></EditItem>
      <Modal
        show={showModal}
        animation={false}
        dialogClassName={`modal-bottom w-[90%] bg-transparent`}
        contentClassName={`bg-transparent border-none`}
        onHide={handleClose}>
        <div className={`bg-transparent`}>
          <div
            className={`mb-[8px] rounded-[13px] bg-[#ffffff] flex flex-column text-center bg-opacity-70 [&>button]:text-blue_primary`}>
            <p className={`text-[#3c3c43] text-[13px] p-[12px]`}>가입조건 성별</p>
            <Button
              value={SEX_TYPE.ALL}
              variant={`text`}
              size={60}
              onClick={e => setGenderType(e.currentTarget.value)}>
              {`제한없음`}
            </Button>
            <Button
              value={SEX_TYPE.MAN}
              variant={`text`}
              size={60}
              onClick={e => setGenderType(e.currentTarget.value)}>{`남성만`}</Button>
            <Button
              value={SEX_TYPE.WOMAN}
              variant={`text`}
              size={60}
              onClick={e => setGenderType(e.currentTarget.value)}>{`여성만`}</Button>
          </div>
          <Button
            className={`bg-white text-blue_primary w-full rounded-[13px]`}
            onClick={handleClose}
            size={60}>
            취소
          </Button>
        </div>
      </Modal>
    </>
  );
}
