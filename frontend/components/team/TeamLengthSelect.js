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
const teamList = createNumberList();

export default function TeamLengthSelect({ value, setValue, title }) {
  return (
    <>
      <EditItemSelect
        placeholder={`팀 수 선택`}
        title={title}
        value={value}
        setValue={setValue}
        list={teamList}></EditItemSelect>
    </>
  );
}
