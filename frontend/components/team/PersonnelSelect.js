import EditItemSelect from "@/components/team/EditItemSelect";

function createNumberList() {
  const numberList = [];
  for (let i = 5; i <= 100; i++) {
    numberList.push({
      value: i,
      name: i + "명",
    });
  }
  return numberList;
}

// 함수 호출하여 숫자 리스트 생성
const personnelList = createNumberList();

export default function PersonnelSelect({ personnel, setPersonnel }) {
  return (
    <>
      <EditItemSelect
        placeholder={`정원 선택`}
        title={`정원`}
        value={personnel}
        setValue={setPersonnel}
        list={personnelList}></EditItemSelect>
    </>
  );
}
