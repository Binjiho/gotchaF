import { TEAM_MEMBER_LEVEL, TEAM_POSITION } from "@/constants/serviceConstants";
import MemberImage from "@/components/team/MemberImage";

export default function TeamMemberProfile({ item }) {
  const isPosition =
    item.level === TEAM_MEMBER_LEVEL.LEADER ||
    item.level === TEAM_MEMBER_LEVEL.MANAGEMENT;

  return (
    <div className={`flex gap-[16px]`}>
      <MemberImage img={item.file_path} role={item.level} size={42}></MemberImage>
      <div>
        <p className={`text-[14px] font-medium`}>{item.name}</p>
        <div className={`text-[#A2A6A9] text-[13px] flex align-items-center`}>
          <p>{TEAM_POSITION[item.position]}</p>
          {isPosition && (
            <>
              <div className={`gap-line mx-[5px]`}></div>
              <p>{TEAM_MEMBER_LEVEL[item.level]}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
