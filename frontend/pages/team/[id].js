import { useEffect, useState } from "react";
import { sendGet } from "@/helper/api";
import { useRouter } from "next/router";
import PrevHeader from "@/components/layout/PrevHeader";
import { Badge, Button, Tabs, Tab, Nav, Spinner } from "react-bootstrap";
import { SEX_TYPE } from "@/constants/serviceConstants";
import ShareIcon from "@/public/icons/social/share-line.svg";
import HeartIcon from "@/public/icons/social/heart-line.svg";
import MoreVerticalIcon from "@/public/icons/system/more-vertical.svg";
import { calculateAge } from "@/helper/value";
import LinkHeader from "@/components/btn/LinkHeader";
import RecommendBtn from "@/components/btn/RecommendBtn";
import NoContentText from "@/components/noContent/noContentText";
import TeamMemberItem from "@/components/team/TeamMemberItem";

export default function Id() {
  const router = useRouter();
  const [teamInfo, setTeamInfo] = useState(null);
  const [teamUser, setTeamUser] = useState([]);
  const teamId = router.query.id;

  const getTeam = function () {
    sendGet(`/api/teams/${teamId}`, null, res => {
      setTeamInfo(res.data.team_info[0]);
      setTeamUser(res.data.team_users);
    });
  };

  useEffect(() => {
    if (!teamId) return;
    getTeam();
  }, [teamId]);

  return (
    <>
      <PrevHeader transparent={true}>
        <Button variant={`text`} type={`right`} className={`text-current`}>
          <MoreVerticalIcon width={24} />
        </Button>
      </PrevHeader>
      <main className={`position-relative`}>
        <div
          className={`position-absolute left-0 top-0 h-[154px] w-full overflow-hidden bg-gray-50`}>
          {teamInfo && (
            <>
              <img
                src={teamInfo.file_path}
                alt=""
                className={`position-absolute w-full h-full object-cover`}
              />
            </>
          )}
        </div>

        <div className={`mt-[106px] position-relative z-2`}>
          {teamInfo ? (
            <>
              <div>
                <div
                  className={`flex justify-between align-items-end mb-[14px] position-absolute right-0 top-[16px]`}>
                  <div className={`flex gap-[12px]`}>
                    {[
                      {
                        icon: ShareIcon,
                        evt: null,
                      },
                      // {
                      //   icon: HeartIcon,
                      //   evt: null,
                      // },
                    ].map((item, index) => (
                      <Button
                        variant={"text"}
                        className={`text-gray9 flex align-items-center justify-content-center bg-gray2 h-[40px] w-[40px] rounded-full`}
                        key={"btn-" + index}
                        onClick={e => item.evt}>
                        <item.icon width={20}></item.icon>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className={`pt-[20px]`}>
                  <p className={`text-[20px] font-bold mb-[6px]`}>{teamInfo.title}</p>
                  <div className={`flex align-items-center gap-[6px]`}>
                    <ul className={`flex gap-[3px] text-[12px] align-items-center`}>
                      <li>{teamInfo.region}</li>
                      <li className={`gap-line`}></li>
                      <li className={`text-gray8`}>멤버 {teamInfo.limit_person}</li>
                    </ul>
                    <div className={`flex gap-[5px]`}>
                      <Badge pill bg="secondary" size={12}>
                        {SEX_TYPE[teamInfo.sex]}
                      </Badge>
                      <Badge pill bg="secondary">
                        {`${calculateAge(teamInfo.min_age)}~${calculateAge(
                          teamInfo.max_age
                        )}세`}
                      </Badge>
                      <Badge pill bg="primary">
                        모집중
                      </Badge>
                    </div>
                  </div>
                  <div
                    className={`border-t mt-[16px] pt-[16px] pb-[20px] text-[14px] text-gray10`}>
                    {teamInfo.contents}
                  </div>
                </div>
              </div>

              <Tab.Container id="left-tabs-example" defaultActiveKey="home">
                <Nav variant="underline">
                  <Nav.Item>
                    <Nav.Link eventKey="home">홈</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="record">기록</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="gallery">갤러리</Nav.Link>
                  </Nav.Item>
                </Nav>
                <hr className={`hr-line`} />
                <Tab.Content>
                  <Tab.Pane eventKey="home">
                    <div>
                      <LinkHeader
                        title={"공지사항"}
                        active={() => {}}
                        className={`pt-[30px] mb-[18px]`}></LinkHeader>
                      <RecommendBtn
                        title={`공지사항을 작성해보세요.`}
                        content={`팀 내 규정 및 매너 수칙 등을 작성하고 멤버들과 공유하세요.`}
                        btnVariant={"gray2"}
                        btnMessage={`글쓰기`}
                        active={() => {}}></RecommendBtn>
                      <NoContentText
                        title={`작성된 공지사항이 없습니다.`}></NoContentText>
                    </div>
                    <div>
                      <LinkHeader
                        title={"경기 일정"}
                        active={() => {}}
                        className={`pt-[50px] mb-[18px]`}></LinkHeader>
                      <RecommendBtn
                        title={`경기를 시작해보세요.`}
                        content={
                          <>
                            대회를 만들거나 참여해 경기를 시작해보세요.
                            <br />
                            대회가 아닌 내부팀 연습 경기로도 일정을 만들 수 있어요!
                          </>
                        }
                        btnMessage={`경기 시작하기`}
                        active={() => {}}></RecommendBtn>
                      <NoContentText title={`아직 경기 일정이 없습니다.`}></NoContentText>
                    </div>
                    <div>
                      <LinkHeader
                        title={"멤버"}
                        className={`pt-[50px] mb-[18px]`}></LinkHeader>
                      {teamUser && (
                        <div className={`flex flex-column gap-[20px] mb-[40px]`}>
                          {teamUser?.map((item, index) => (
                            <TeamMemberItem
                              item={item}
                              key={`member-${index}`}></TeamMemberItem>
                          ))}
                        </div>
                      )}
                      <RecommendBtn
                        title={`새로운 멤버를 초대해 보세요.`}
                        content={`SNS나 문자, 링크로 공유하고 쉽게 초대하세요.`}
                        btnMessage={`멤버 초대하기`}
                        active={() => {}}></RecommendBtn>
                      <RecommendBtn
                        title={`운영진 멤버를 선정하고 권한을 설정하세요.`}
                        content={`공지사항 작성, 경기 만들기 등 팀의 일을 함께 할 운영진을 선정하고 권한을 설정하세요.`}
                        btnMessage={`팀 설정 관리`}
                        btnVariant={"green-sub"}
                        className={"mt-[10px]"}
                        active={() => {}}></RecommendBtn>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="record">Second tab content</Tab.Pane>
                  <Tab.Pane eventKey="gallery">Second tab content</Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </>
          ) : (
            <div className={"text-center pt-4"}>
              <Spinner></Spinner>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
