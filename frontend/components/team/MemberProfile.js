import KingIcon from "@/public/icons/label/label_king.svg";
import StarIcon from "@/public/icons/label/label_star.svg";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";

export default function MemberProfile({ img, role = "", size = 24 }) {
  const iconSize = size === 42 ? 20 : size === 24 ? 12 : size / 2;

  return (
    <div className={`position-relative w-fit`}>
      <div
        className={`rounded-full overflow-hidden bg-gray1`}
        style={{ width: `${size}px`, height: `${size}px` }}>
        {img && <img src={img} alt="" className={`w-full h-full object-fit-cover`} />}
      </div>
      {role === TEAM_MEMBER_LEVEL.LEADER ? (
        <KingIcon
          className={`position-absolute right-[-4px] bottom-[0px] text-blue_primary`}
          style={{ width: `${iconSize}px` }}
        />
      ) : role === TEAM_MEMBER_LEVEL.MANAGEMENT ? (
        <StarIcon
          className={`position-absolute right-[-4px] bottom-[0px] text-[#FFBE15]`}
          style={{ width: `${iconSize}px` }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
