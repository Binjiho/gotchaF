export default function TeamMemberProfile({ item, size }) {
  const imageSize = size === "big" ? 42 : 32;

  return (
    <div className={`flex gap-[16px] align-items-center`}>
      <div
        className={`rounded-full overflow-hidden bg-gray1`}
        style={{ width: `${imageSize}px`, height: `${imageSize}px` }}>
        {item.file_path && (
          <img src={item.file_path} alt="" className={`w-full h-full object-fit-cover`} />
        )}
      </div>
      <div>
        <p className={`text-[14px] font-medium`}>{item.title}</p>
        {size === "big" && (
          <div className={`text-[#A2A6A9] text-[13px] flex align-items-center`}>
            <p>주최팀</p>
            <div className={`gap-line mx-[5px]`}></div>
            <p>{item.region}</p>
          </div>
        )}
      </div>
    </div>
  );
}
