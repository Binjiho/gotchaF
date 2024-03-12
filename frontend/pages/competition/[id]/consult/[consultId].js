import { useRouter } from "next/router";
import { sendGet } from "@/helper/api";
import { useEffect, useState } from "react";
import PrevHeader from "@/components/layout/PrevHeader";
import MemberImage from "@/components/team/MemberImage";
import { printDateTimeFormat } from "@/helper/value";
import { Button } from "react-bootstrap";
import { shareNowUrl } from "@/helper/UIHelper";
import StateLine from "@/public/icons/system/shate-line.svg";

export default function ConsultId() {
  const router = useRouter();
  const competitionId = router.query.id;
  const consultId = router.query.consultId;
  const [consult, setConsult] = useState(null);

  const getConsult = function () {
    sendGet(`/api/boards/board-inquire/${competitionId}/${consultId}`, null, res => {
      setConsult(res.data.result);
    });
  };

  useEffect(() => {
    if (!consultId) return;
    getConsult();
  }, [consultId]);

  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={`inner`}>
        {consult && (
          <>
            <div
              className={`flex gap-[9px] align-items-center border-b-[1px] border-gray2 py-[15px]`}>
              <MemberImage
                img={consult.team_thum}
                role={consult.level}
                size={38}></MemberImage>
              <div className={`flex flex-column `}>
                <p className={`text-gray10 text-[13px]`}>{consult.team_name}</p>
                <span className={`text-[12px] text-gray7`}>
                  {printDateTimeFormat(consult.created_at, "MM월 dd일")}
                </span>
              </div>
            </div>
            <div className={`pt-[20px]`}>
              <h3 className={`text-[18px] text-gray10 font-medium`}>{consult.title}</h3>
              <p className={`pt-[20px] text-[15px] text-gray10 whitespace-pre-wrap`}>
                {consult.contents}
              </p>
              <div className={`mt-[20px]`}>
                <img src={consult.file} alt="" className={`w-full`} />
              </div>
            </div>
            <div className={`mt-[30px] pb-[50px]`}>
              <Button
                variant={`text`}
                size={50}
                className={`border !border-gray4 rounded-[3px] w-full flex align-items-center justify-center gap-[6px]`}
                onClick={shareNowUrl}>
                <StateLine width={18}></StateLine>
                <span className={`text-[15px] font-bold`}>공유</span>
              </Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
