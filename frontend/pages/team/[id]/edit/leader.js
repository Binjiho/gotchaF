import PrevHeader from "@/components/layout/PrevHeader";
import { sendGet, sendPost } from "@/helper/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TodoLineIcon from "@/public/icons/other/todo-line.svg";
import MemberProfile from "@/components/team/MemberProfile";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";
import { useModal } from "@/context/ModalContext";

export default function Leader() {
  const router = useRouter();
  const teamId = router.query.id;
  const [nowTeamUser, setNowTeamUser] = useState([]);
  const { openModal } = useModal();

  const getTeam = function () {
    sendGet(`/api/teams/${teamId}`, null, res => {
      const nowTeam = [];

      res.data.team_users.map(item => {
        if (item.level !== TEAM_MEMBER_LEVEL.WAITING_JOIN) {
          nowTeam.push(item);
        }
      });

      setNowTeamUser(nowTeam);
    });
  };

  useEffect(() => {
    if (!teamId) return;
    getTeam();
  }, [teamId]);

  const transConfirm = item => {
    const modalContent = (
      <div className={`text-center`}>
        <strong className={`text-[18px]`}>리더 양도</strong>
        <p className={`text-[14px] mt-[10px]`}>
          000님에게 리더를 양도하시겠습니까?
          <br />
          양도 후에는 취소하실 수 없습니다.
        </p>
      </div>
    );

    openModal(
      modalContent,
      async () => {
        await transLeader(item);
      },
      () => {
        return;
      }
    );
  };

  const transLeader = item => {
    const data = {
      tid: teamId,
      uid: item.sid,
    };

    sendPost(
      `/api/teams/mendate`,
      data,
      res => {
        router.back();
        toast("리더가 양도되었습니다.");
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
          리더 양도
        </h2>
      </PrevHeader>
      <main>
        {!nowTeamUser.length ? (
          <div
            className={`flex flex-column align-items-center justify-center gap-[12px] pt-[100px]`}>
            <TodoLineIcon width={50} className={`text-gray6`}></TodoLineIcon>
            <p className={`text-gray7 text-[14px]`}>멤버가 없습니다.</p>
          </div>
        ) : (
          <>
            {nowTeamUser.map(item => (
              <div
                key={item.sid}
                className={`flex justify-between align-items-center py-[10px]`}>
                <MemberProfile img={null} role={""} size={42}></MemberProfile>
                <div className={`ml-[16px] mr-auto flex flex-column`}>
                  <p className={`text-[14px] font-medium`}>{item.name}</p>
                  <span className={`text-[13px] text-[#A2A6A9]`}>공격수</span>
                </div>
                <Button
                  variant="black"
                  size="32"
                  className={`w-[81px] !flex-[0_0_81px]`}
                  onClick={() => transConfirm(item)}>
                  양도
                </Button>
              </div>
            ))}
          </>
        )}
      </main>
    </>
  );
}
