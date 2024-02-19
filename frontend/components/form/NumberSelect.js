import MinusIcon from "@/public/icons/system/minus-line.svg";
import PlusIcon from "@/public/icons/system/add-line.svg";

export default function NumberSelect({ score, setScore }) {
  const minusScore = () => {
    setScore(score - 1);
  };

  const addScore = () => {
    setScore(score + 1);
  };

  return (
    <div className={`flex align-items-center gap-[15px] text-gray10`}>
      <button
        className={`w-[32px] h-[32px] rounded-full bg-[#F5F7F8] flex align-items-center justify-center`}
        onClick={minusScore}>
        <MinusIcon width={24}></MinusIcon>
      </button>
      <div
        className={`border-[1px] !border-gray3 rounded-[3px] px-[12px] py-[7px] min-w-[42px] text-center font-bold`}>
        {score}
      </div>
      <button
        className={`w-[32px] h-[32px] rounded-full bg-[#F5F7F8] flex align-items-center justify-center`}
        onClick={addScore}>
        <PlusIcon width={24}></PlusIcon>
      </button>
    </div>
  );
}
