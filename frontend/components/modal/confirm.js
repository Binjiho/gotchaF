import React from "react";
import { useModal } from "@/context/ModalContext";
import { Button } from "react-bootstrap";

const ModalConfirm = () => {
  const { modalOpen, closeModal, modalContent, confirmModal } = useModal();

  if (!modalOpen || !modalContent) return null;

  return (
    <div className="position-fixed bg-black/40 w-full left-0 top-0 h-full z-[99999]">
      <div className="position-absolute top-[50%] left-[50%] bg-white rounded-[8px] shadow-xl p-[20px] translate-y-[-50%] translate-x-[-50%] max-w-[340px] w-full">
        {modalContent}
        <div className="flex justify-center gap-[10px] pt-[30px]">
          <Button
            onClick={closeModal}
            variant="green-primary-line"
            className={`w-full`}
            size={50}>
            취소
          </Button>
          <Button
            onClick={confirmModal}
            variant="green-primary"
            className={`w-full`}
            size={50}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
