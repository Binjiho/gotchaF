import KingIcon from "@/public/icons/label/label_king.svg";

export default function MemberProfile({ img, role, size = 24 }) {
  const iconSize = size === 42 ? 20 : size === 24 ? 12 : 10;

  return (
    <div className={`position-relative w-fit`}>
      <div
        className={`rounded-full overflow-hidden bg-gray1`}
        style={{ width: `${size}px`, height: `${size}px` }}>
        {img && <img src={img} alt="" className={`w-full h-full object-fit-cover`} />}
      </div>
      {role === 1 && (
        <KingIcon
          className={`position-absolute right-[-4px] bottom-[0px] text-blue_primary`}
          style={{ width: `${iconSize}px` }}
        />
      )}
    </div>
  );
}
