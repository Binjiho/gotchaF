import EditItem from "@/components/team/EditItem";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

function createYearList() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 80; // 80년 전 연도 계산

  const yearList = [];
  for (let year = currentYear; year >= startYear; year--) {
    yearList.push(year);
  }

  return yearList;
}

// 함수 호출하여 연도 리스트 생성
const yearList = createYearList();

export default function YearSelect({ year, setYear, title }) {
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    if (!year) return;
    handleClose();
  }, [year]);

  return (
    <>
      <EditItem
        placeholder={`나이 선택`}
        title={title}
        value={year ? year + "년생" : null}
        onButtonClick={handleButtonClick}></EditItem>
      <Modal
        show={showModal}
        animation={false}
        dialogClassName={`modal-bottom w-[100%] bottom-0`}
        onHide={handleClose}>
        <div className={`flex flex-column max-h-[50vh] overflow-y-auto mt-4 pb-4`}>
          {yearList.map((item, index) => (
            <Button
              className={`border-bottom !border-gray-100 hover:bg-gray-200 ${
                year == item && "bg-gray-200"
              }`}
              value={item}
              key={`year-${index}`}
              variant={`text`}
              size={40}
              onClick={e => setYear(e.currentTarget.value)}>
              {item}
            </Button>
          ))}
        </div>
      </Modal>
    </>
  );
}
