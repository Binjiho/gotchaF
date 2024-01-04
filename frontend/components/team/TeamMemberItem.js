import KingIcon from "@/public/icons/label/label_king.svg";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";
import MemberProfile from "@/components/team/MemberProfile";

export default function TeamMemberItem({ item }) {
  return (
    <div className={`flex gap-[16px]`}>
      <MemberProfile img={item.img} role={item.level} size={42}></MemberProfile>
      <div>
        <p className={`text-[14px] font-medium`}>{item.name}</p>
        <p className={`text-[#A2A6A9] text-[13px]`}>lorem lorem</p>
      </div>
    </div>
  );
}
