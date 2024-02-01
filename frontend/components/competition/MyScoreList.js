import { useRef } from "react";

export default function MyScoreList({ list }) {
  const itemRef = useRef();

  return (
    <ul className={`bg-gray1 rounded-[5px] py-[18px] px-[10px] flex justify-between`}>
      {list?.map((item, index) => (
        <>
          <li
            className={"flex justify-between w-full align-items-center"}
            key={itemRef + "-index"}>
            <div
              className={`w-full flex flex-column align-items-center justify-center gap-[1px] text-gray10`}>
              <strong className={`text-[18px] font-medium`}>{item.score}</strong>
              <p className={`text-[12px]`}>{item.title}</p>
            </div>
            {list.length !== index + 1 && (
              <div className={`h-[38px] w-[1px] bg-gray4`}></div>
            )}
          </li>
        </>
      ))}
    </ul>
  );
}
