import RoundProfile from "@/components/image/RoundProfile";
import CupFillIcon from "@/public/icons/social/cup_fill.svg";

export default function CupRankItem({ rank }) {
  return (
    <div className={`bg-gray1 w-[173px] rounded-[5px] text-[13px]`}>
      {(!rank.title1 && !rank.title2) ||
      (rank.state === "N" && (!rank.title1 || !rank.title2)) ? (
        <div className={`h-[103px] flex items-center justify-center text-gray10`}>
          이전 라운드 결과 대기중
        </div>
      ) : (
        <ul
          className={`[&_li]:px-[15px] [&_li]:h-[50px] [&_li]:flex [&_li]:items-center [&_p]:flex-auto [&_p]:font-bold [&_p]:ml-[6px] [&_svg]:text-yellow_primary [&_span]:w-[10px] [&_span]:text-right [&_span]:mr-[5px] w-full`}>
          <li className={`border-b-[1px] !border-gray3`}>
            <RoundProfile img={rank.thum1} size={24}></RoundProfile>
            <p>{rank.title1 || "-"}</p>
            <span>{rank.state === "N" ? "-" : rank.t1_score}</span>
            <div className={`w-[16px]`}>
              {rank.t1_score > rank.t2_score && <CupFillIcon width={16}></CupFillIcon>}
            </div>
          </li>
          <li>
            <RoundProfile img={rank.thum2} size={24}></RoundProfile>
            <p>{rank.title2 || "-"}</p>
            <span>{rank.state === "N" ? "-" : rank.t2_score}</span>
            <div className={`w-[16px]`}>
              {rank.t2_score > rank.t1_score && <CupFillIcon width={16}></CupFillIcon>}
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
