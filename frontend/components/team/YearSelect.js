import EditItemSelect from "@/components/team/EditItemSelect";

function createYearList() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 35; // 35년 전 연도 계산
  const endYear = currentYear - 20;

  const yearList = [];
  for (let year = endYear; year >= startYear; year--) {
    yearList.push({
      value: year,
      name: year + "년도",
    });
  }

  return yearList;
}

// 함수 호출하여 연도 리스트 생성
const yearList = createYearList();

export default function YearSelect({ year, setYear, title }) {
  return (
    <>
      <EditItemSelect
        placeholder={`나이 선택`}
        title={title}
        value={year}
        setValue={setYear}
        list={yearList}></EditItemSelect>
    </>
  );
}
