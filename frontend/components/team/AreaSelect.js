import EditItem from "@/components/team/EditItem";
import PrevFullModal from "@/components/modal/PrevFullModal";
import { useState } from "react";

export default function AreaSelect() {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <EditItem
        placeholder={`지역 선택`}
        title={`지역`}
        onButtonClick={handleButtonClick}></EditItem>
      <PrevFullModal show={showModal} setShow={setShowModal}>
        <p type={`middle`}>지역 설정</p>
      </PrevFullModal>
    </>
  );
}
