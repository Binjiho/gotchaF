import { Modal } from "react-bootstrap";
import CloseIcon from "@/public/icons/system/close-line.svg";
import React from "react";

export default function BottomSheetModal({ children, show, setShow }) {
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props?.type === type);
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      animation={false}
      centered={true}
      dialogClassName={"max-w-layout m-auto"}
      contentClassName={"rounded-b-none position-fixed bottom-0 max-w-layout"}>
      <header className={"pt-[20px] pb-[15px] flex mx-[20px]"}>
        <div className={"text-[20px] mr-auto font-bold text-gray10"}>
          {renderChildrenByType("left")}
        </div>
        <button
          className={"bg-transparent h-fit mt-[2px]"}
          onClick={() => setShow(false)}>
          <CloseIcon width={24} />
        </button>
      </header>
      <div className={`overflow-y-auto max-h-[80vh]`}>
        {renderChildrenByType("content")}
      </div>
    </Modal>
  );
}
