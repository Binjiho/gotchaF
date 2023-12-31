import PrevHeader from "@/components/layout/PrevHeader";
import { sendGet } from "@/helper/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MemberProfile from "@/components/team/MemberProfile";
import { printDateTimeFormat } from "@/helper/value";
import { Button } from "react-bootstrap";
import StateLine from "@/public/icons/system/shate-line.svg";

export default function Id() {
  const router = useRouter();
  const noticeId = router.query.id;
  const [notice, setNotice] = useState([]);

  const getNotice = function () {
    sendGet(`/api/boards/${noticeId}`, null, res => {
      setNotice(res.data.board[0]);
    });
  };

  useEffect(() => {
    if (!noticeId) return;
    getNotice();
  }, [noticeId]);

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          공지글
        </h2>
      </PrevHeader>
      <main>
        <div
          className={`flex gap-[9px] align-items-center border-b-[1px] border-gray2 py-[15px]`}>
          <MemberProfile img={null} role={""} size={38}></MemberProfile>
          <div className={`flex flex-column `}>
            <p className={`text-gray10 text-[13px]`}>{notice.writer}</p>
            <span className={`text-[12px] text-gray7`}>
              {printDateTimeFormat(notice.created_at, "MM월 dd일")}
            </span>
          </div>
        </div>
        <div className={`pt-[20px]`}>
          <h3 className={`text-[18px] text-gray10 font-medium`}>{notice.title}</h3>
          <p className={`pt-[20px] text-[15px] text-gray10`}>{notice.contents}</p>
        </div>
        <div className={`mt-[30px] pb-[50px]`}>
          <Button
            variant={`text`}
            size={50}
            className={`border !border-gray4 rounded-[3px] w-full flex align-items-center justify-center gap-[6px]`}>
            <StateLine width={18}></StateLine>
            <span className={`text-[15px] font-bold`}>공유</span>
          </Button>
        </div>
      </main>
    </>
  );
}
