import KingIcon from "@/public/icons/label/label_king.svg";

export default function TeamMemberItem({ item }) {
  return (
    <div className={`flex gap-[16px]`}>
      <div className={`position-relative`}>
        <div className={`w-[42px] h-[42px] rounded-full overflow-hidden bg-gray1`}>
          {item.img && <img src="" alt="" className={`w-full h-full object-fit-cover`} />}
        </div>
        <KingIcon
          className={`w-[20px] position-absolute right-[-4px] bottom-[0px] text-blue_primary`}
        />
      </div>
      <div>
        <p className={`text-[14px] font-medium`}>{item.name}</p>
        <p className={`text-[#A2A6A9] text-[13px]`}>lorem lorem</p>
      </div>
    </div>
  );
}
