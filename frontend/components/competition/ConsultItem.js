import MemberImage from "@/components/team/MemberImage";
import { printDateTimeFormat } from "@/helper/value";
import { useRouter } from "next/router";

export default function ConsultItem({ item }) {
  const router = useRouter();
  const competitionId = router.query.id;

  const goNoticePage = sid => {
    router.push(`/competition/${competitionId}/consult/${sid}`);
  };

  return (
    <div
      className={`rounded-[5px] py-[20px] w-full cursor-pointer`}
      onClick={() => goNoticePage(item.sid)}>
      <div className={`flex justify-between align-items-center`}>
        <div className={`flex gap-[9px] align-items-center`}>
          <MemberImage img={item.thum} size={24} role={item.level}></MemberImage>
          <p className={`text-gray10 text-[13px]`}>{item.team_name}</p>
        </div>
        <p className={`text-[13px] text-gray7`}>
          {printDateTimeFormat(item.created_at, "MM월 dd일")}
        </p>
      </div>
      <div className={`flex gap-[12px] mt-[10px]`}>
        <div className={`flex-[1_1_calc(100%-76px)]`}>
          <p className={`text-[14px] font-medium mb-[4px] text-overflow-dot`}>
            {item.title}
          </p>
          <p className={`text-[13px] text-gray9 text-overflow-dot-2`}>{item.contents}</p>
        </div>
        {item.file && (
          <div
            className={`w-[64px] h-[64px] bg-[#D9D9D9] rounded-[3px] overflow-hidden flex-none`}>
            <img src={item.file} alt="" className={`w-full object-cover h-full`} />
          </div>
        )}
      </div>
    </div>
  );
}
