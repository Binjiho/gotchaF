import PrevHeader from "@/components/layout/PrevHeader";
import { sendGet, sendPost } from "@/helper/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TodoLineIcon from "@/public/icons/other/todo-line.svg";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";

export default function Join() {
  const router = useRouter();
  const teamId = router.query.id;
  const [waitUserList, setWaitUserList] = useState([]);

  const getJoin = function () {
    sendPost(`/api/teams/waitup/${teamId}`, null, res => {
      setWaitUserList(res.data.wait_users);
    });
  };

  useEffect(() => {
    if (!teamId) return;
    getJoin();
  }, [teamId]);

  const joinAccess = item => {
    const data = {
      tid: teamId,
      uid: item.sid,
    };

    const updateItem = {
      ...item,
      access: true,
    };

    sendPost(
      `/api/teams/confirm`,
      data,
      res => {
        toast(`${item.name}님이 가입되었습니다.`);

        const list = waitUserList.map(item =>
          item.sid === updateItem.sid ? { ...item, ...updateItem } : item
        );

        setWaitUserList(list);
      },
      res => {
        toast(res.response.data.message);
      }
    );
  };

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          가입대기리스트
        </h2>
      </PrevHeader>
      <main>
        {!waitUserList.length ? (
          <div
            className={`flex flex-column align-items-center justify-center gap-[12px] pt-[100px]`}>
            <TodoLineIcon width={50} className={`text-gray6`}></TodoLineIcon>
            <p className={`text-gray7 text-[14px]`}>가입대기 인원이 없습니다.</p>
          </div>
        ) : (
          <>
            {waitUserList.map(item => (
              <div
                key={item.sid}
                className={`flex justify-between align-items-center py-[10px]`}>
                <TeamMemberProfile item={item}></TeamMemberProfile>
                {item.access ? (
                  <Button
                    variant="gray2"
                    size="32"
                    className={`w-[81px] !flex-[0_0_81px]`}>
                    가입완료
                  </Button>
                ) : (
                  <Button
                    variant="green-primary"
                    size="32"
                    className={`w-[81px] !flex-[0_0_81px]`}
                    onClick={() => joinAccess(item)}>
                    승인
                  </Button>
                )}
              </div>
            ))}
          </>
        )}
      </main>
    </>
  );
}
