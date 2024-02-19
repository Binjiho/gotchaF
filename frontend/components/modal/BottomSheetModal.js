import { Modal } from "react-bootstrap";
import CloseIcon from "@/public/icons/system/close-line.svg";
import React from "react";

export default function BottomSheetModal({ children, show, setShow }) {
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props.type === type);
  };

  return (
    <Modal
      show={show}
      animation={false}
      centered={true}
      dialogClassName={"max-w-layout m-auto"}
      contentClassName={"rounded-b-none position-fixed bottom-0"}>
      <header
        className={
          "pt-[20px] pb-[15px] flex align-items-center mx-[20px] border-b-[1px] !border-gray3"
        }>
        <div className={"text-[20px] mr-auto font-bold text-gray10"}>
          {renderChildrenByType("left")}
        </div>
        <button className={"bg-transparent"} onClick={() => setShow(false)}>
          <CloseIcon width={24} />
        </button>
      </header>
      <div>{renderChildrenByType("content")}</div>
    </Modal>
  );
}
