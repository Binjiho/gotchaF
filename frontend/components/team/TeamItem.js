import { Badge } from "react-bootstrap";
import { SEX_TYPE } from "@/constants/serviceConstants";
import { useRouter } from "next/router";

export default function TeamItem({ item }) {
  const router = useRouter();

  const detailTeam = () => {
    router.push(`/team/${item.sid}`);
  };

  return (
    <div className={`flex gap-[16px] py-[10px] cursor-pointer`} onClick={detailTeam}>
      <div
        className={`w-[62px] h-[62px] rounded-full overflow-hidden bg-gray2 flex-none`}>
        {item.file_path && (
          <img src={item.file_path} alt="" className={`w-[62px] h-[62px]`} />
        )}
      </div>
      <div className={`w-[calc(100%-78px)]`}>
        <p className={`text-[16px] mb-[3px]`}>{item.title}</p>
        {/*<p className={`text-[14px] text-gray7 text-overflow-dot mb-[2px]`}>*/}
        {/*  {item.contents}*/}
        {/*</p>*/}
        <ul className={`flex gap-[3px] text-[12px] align-items-center`}>
          <li>{item.region}</li>
          <li className={`gap-line`}></li>
          <li className={`text-gray8`}>멤버 {item.limit_person}</li>
        </ul>
        <div className={`flex gap-[5px] mt-1`}>
          <Badge pill bg="secondary" size={12}>
            {SEX_TYPE[item.sex]}
          </Badge>
          <Badge pill bg="secondary">
            {`${item.min_age}~${item.max_age}세`}
          </Badge>
          <Badge pill bg="primary">
            모집중
          </Badge>
        </div>
      </div>
    </div>
  );
}
