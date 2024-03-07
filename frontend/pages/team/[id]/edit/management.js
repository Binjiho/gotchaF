import PrevHeader from "@/components/layout/PrevHeader";
import { sendGet, sendPost } from "@/helper/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TodoLineIcon from "@/public/icons/other/todo-line.svg";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";

export default function Management() {
  const router = useRouter();
  const teamId = router.query.id;
  const [nowTeamUser, setNowTeamUser] = useState([]);

  const getTeam = function () {
    sendGet(`/api/teams/detail/${teamId}`, null, res => {
      const nowTeam = [];

      res.data.team_users.map(item => {
        if (
          item.level !== TEAM_MEMBER_LEVEL.WAITING_JOIN &&
          item.level !== TEAM_MEMBER_LEVEL.LEADER
        ) {
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

  const toggleManagement = item => {
    const data = {
      tid: teamId,
      uid: item.sid,
    };

    sendPost(
      `/api/teams/manager-member`,
      data,
      res => {
        toast(
          `${item.name}님이 ${
            item.level === TEAM_MEMBER_LEVEL.MANAGEMENT ? "일반회원" : "운영진"
          }이 되었습니다.`
        );
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
          운영진 관리
        </h2>
      </PrevHeader>
      <main className={`inner`}>
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
                {item.level === TEAM_MEMBER_LEVEL.MANAGEMENT ? (
                  <Button
                    variant="gray2"
                    size="32"
                    className={`w-[61px] !flex-[0_0_61px]`}
                    onClick={() => toggleManagement(item)}>
                    일반
                  </Button>
                ) : (
                  <Button
                    variant="yellow-primary"
                    size="32"
                    className={`w-[61px] !flex-[0_0_61px]`}
                    onClick={() => toggleManagement(item)}>
                    운영진
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
