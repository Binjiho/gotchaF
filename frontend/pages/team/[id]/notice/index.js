import PrevHeader from "@/components/layout/PrevHeader";
import TodoLineIcon from "@/public/icons/other/todo-line.svg";
import { useEffect, useState } from "react";
import { sendGet } from "@/helper/api";
import { useRouter } from "next/router";
import NoticeItem from "@/components/team/NoticeItem";
import FloatAddBtn from "@/components/btn/FloatAddBtn";

export default function Notice() {
  const router = useRouter();
  const [teamNotice, setTeamNotice] = useState([]);
  const teamId = router.query.id;

  const getNotice = function () {
    sendGet(`/api/boards/board-notice/${teamId}`, null, res => {
      setTeamNotice(res.data.boards.data);
    });
  };

  useEffect(() => {
    if (!teamId) return;
    getNotice();
  }, [teamId]);

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          공지사항
        </h2>
      </PrevHeader>
      <main>
        {!teamNotice.length ? (
          <div
            className={`flex flex-column align-items-center justify-center gap-[12px] pt-[100px]`}>
            <TodoLineIcon width={50} className={`text-gray6`}></TodoLineIcon>
            <p className={`text-gray7 text-[14px]`}>아직 공지사항이 없습니다.</p>
          </div>
        ) : (
          <>
            {teamNotice.map(item => (
              <div key={item.sid}>
                <div className={`inner`}>
                  <NoticeItem item={item}></NoticeItem>
                </div>
                <hr className={`hr-line`} />
              </div>
            ))}
            <FloatAddBtn
              path={`/team/${teamId}/notice/create`}
              text={"글쓰기"}></FloatAddBtn>
          </>
        )}
      </main>
    </>
  );
}
