import RoundProfile from "@/components/image/RoundProfile";

export default function RoundItem({ item }) {
  return (
    <>
      <div>
        <span>{item.round}라운드</span>
        <ul>
          {item.list.map(match => {
            return (
              <li
                className={`border-[1px] rounded-[3px] py-[18px] px-[24px]`}
                key={match.sid}>
                <RoundProfile size={46}></RoundProfile>
                <p className={`text-[13px] text-gray10 font-bold`}>{match.title1}</p>
                <p className={`text-[13px] text-gray10 font-bold`}>{match["title2 "]}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
