import PrevHeader from "@/components/layout/PrevHeader";
import { sendGet, sendPost } from "@/helper/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TodoLineIcon from "@/public/icons/other/todo-line.svg";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";

export default function Quit() {
  const router = useRouter();
  const teamId = router.query.id;
  const [nowTeamUser, setNowTeamUser] = useState([]);

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

  const quitMember = item => {
    const data = {
      tid: teamId,
      uid: item.sid,
    };

    sendPost(
      `/api/teams/delete-member`,
      data,
      res => {
        toast(`${item.name}님이 탈퇴되었습니다.`);
        getTeam();
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
          멤버 탈퇴
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
                <TeamMemberProfile item={item}></TeamMemberProfile>
                <Button
                  variant="red-primary"
                  size="32"
                  className={`w-[61px] !flex-[0_0_61px]`}
                  onClick={() => quitMember(item)}>
                  탈퇴
                </Button>
              </div>
            ))}
          </>
        )}
      </main>
    </>
  );
}
