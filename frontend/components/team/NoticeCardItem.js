import MemberProfile from "@/components/team/MemberProfile";
import { useRouter } from "next/router";

export default function NoticeCardItem({ item }) {
  const router = useRouter();
  const teamId = router.query.id;

  const goNoticePage = sid => {
    router.push(`/team/${teamId}/notice/${sid}`);
  };

  return (
    <div
      className={`border !border-gray3 rounded-[5px] p-[14px] w-full h-[128px] cursor-pointer`}
      onClick={() => goNoticePage(item.sid)}>
      <div>
        <div className={`flex gap-[9px] align-items-center`}>
          <MemberProfile img={null} role={1} size={24}></MemberProfile>
          <p className={`text-gray10 text-[13px]`}>{item.writer}</p>
        </div>
      </div>
      <div className={`flex gap-[12px] mt-[10px]`}>
        <div className={`flex-[1_1_calc(100%-76px)]`}>
          <p className={`text-[14px] font-medium mb-[4px] text-overflow-dot`}>
            {item.title}
          </p>
          <p className={`text-[13px] text-gray9 text-overflow-dot-2`}>{item.contents}</p>
        </div>
        {item.file_path && (
          <div
            className={`w-[64px] h-[64px] bg-[#D9D9D9] rounded-[3px] overflow-hidden flex-none`}>
            <img src={item.file_path} alt="" className={`w-full object-cover h-full`} />
          </div>
        )}
      </div>
    </div>
  );
}
