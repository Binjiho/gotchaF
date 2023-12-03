import EditItem from "@/components/team/EditItem";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

function createNumberList() {
  const numberList = [];
  for (let i = 5; i <= 100; i++) {
    numberList.push(i);
  }
  return numberList;
}

// 함수 호출하여 숫자 리스트 생성
const personnelList = createNumberList();

export default function PersonnelSelect({ personnel, setPersonnel }) {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (!personnel) return;
    handleClose();
  }, [personnel]);

  return (
    <>
      <EditItem
        placeholder={`정원 선택`}
        title={`정원`}
        value={personnel ? personnel + "명" : null}
        onButtonClick={handleButtonClick}></EditItem>
      <Modal
        show={showModal}
        animation={false}
        dialogClassName={`modal-bottom w-[100%] bottom-0`}
        onHide={handleClose}>
        <div className={`flex flex-column max-h-[50vh] overflow-y-auto mt-4 pb-4`}>
          {personnelList.map((item, index) => (
            <Button
              className={`border-bottom !border-gray-100 hover:bg-gray-200 ${
                personnel == item && "bg-gray-200"
              }`}
              value={item}
              key={`personnel-${index}`}
              variant={`text`}
              size={40}
              onClick={e => setPersonnel(e.currentTarget.value)}>
              {item}
            </Button>
          ))}
        </div>
      </Modal>
    </>
  );
}
