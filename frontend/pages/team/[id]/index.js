import { useEffect, useState } from "react";
import { sendAnonymousGet, sendGet, sendPost } from "@/helper/api";
import { useRouter } from "next/router";
import PrevHeader from "@/components/layout/PrevHeader";
import { Badge, Button, Tab, Nav, Spinner } from "react-bootstrap";
import {
  COMPETITION_TYPE,
  SEX_TYPE,
  TEAM_MEMBER_LEVEL,
} from "@/constants/serviceConstants";
import ShareIcon from "@/public/icons/social/share-line.svg";
import MoreVerticalIcon from "@/public/icons/system/more-vertical.svg";
import { calculateAge } from "@/helper/value";
import LinkHeader from "@/components/btn/LinkHeader";
import RecommendBtn from "@/components/btn/RecommendBtn";
import NoContentText from "@/components/noContent/noContentText";
import TeamMemberProfile from "@/components/team/TeamMemberProfile";
import NoticeCardItem from "@/components/team/NoticeCardItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, setCookie } from "@/helper/cookies";
import { toast } from "react-toastify";
import { shareNowUrl } from "@/helper/UIHelper";
import { setUser } from "@/actions/userActions";
import FloatAddBtn from "@/components/btn/FloatAddBtn";
import Image from "@/public/icons/tool/image.svg";
import MatchItem from "@/components/team/MatchItem";

export default function Index() {
  const router = useRouter();
  const [teamInfo, setTeamInfo] = useState(null);
  const [nowTeamUser, setNowTeamUser] = useState([]);
  const [teamNotice, setTeamNotice] = useState([]);
  const [teamGallery, setTeamGallery] = useState([]);
  const [teamMatch, setTeamMatch] = useState([]);
  const teamId = router.query.id;
  const user = useSelector(state => state.user);
  const [isSendJoin, setIsSendJoin] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isManagement, setIsManagement] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const dispatch = useDispatch();
  const [key, setKey] = useState("home");

  const getTeam = function () {
    sendAnonymousGet(`/api/teams/detail/${teamId}`, null, res => {
      setTeamInfo(res.data.team_info[0]);
      setIsSendJoin(res.data.team_users.find(item => item.sid === user.sid));

      const nowTeam = [];

      res.data.team_users.map(item => {
        if (item.level !== TEAM_MEMBER_LEVEL.WAITING_JOIN) {
          nowTeam.push(item);
        }

        if (item.sid === user.sid) {
          if (item.level === TEAM_MEMBER_LEVEL.LEADER) {
            setIsLeader(true);
          }

          if (item.level === TEAM_MEMBER_LEVEL.MANAGEMENT) {
            setIsManagement(true);
          }

          if (item.level !== TEAM_MEMBER_LEVEL.WAITING_JOIN) {
            setIsMember(true);
          }
        }
      });

      setNowTeamUser(nowTeam);
    });
  };

  const getNotice = function () {
    sendAnonymousGet(`/api/boards/board-notice/${teamId}`, null, res => {
      setTeamNotice(res.data.boards.data);
    });
  };

  const getGallery = function () {
    sendAnonymousGet(`/api/boards/board-gallery/${teamId}`, null, res => {
      setTeamGallery(res.data.boards);
    });
  };

  const getTeamMatch = function () {
    sendAnonymousGet(`/api/teams/detail-match/${teamId}`, null, res => {
      setTeamMatch(res.data.result);
    });
  };

  useEffect(() => {
    if (!teamId) return;

    if (key === "home") {
      getTeam();
      getNotice();
    } else if (key === "record") {
      getTeamMatch();
    } else if (key === "gallery") {
      getGallery();
    }
  }, [key, teamId]);

  const joinTeam = async () => {
    const token = await getCookie("accessToken");

    const data = {
      tid: Number(teamId),
      uid: token,
    };

    sendPost(`/api/teams/signup/${teamId}`, data, res => {
      toast("팀 가입신청을 보냈습니다.");
      dispatch(
        setUser({
          ...user,
          tid: teamId,
        })
      );
      setCookie(
        "user",
        JSON.stringify({
          ...user,
          tid: teamId,
        }),
        7
      );
      getTeam();
    });
  };

  const goTeamSetting = () => {
    router.push(`/team/${teamId}/setting`);
  };

  return (
    <>
      <PrevHeader transparent={true}>
        {(isLeader || isManagement) && (
          <Button
            variant={`text`}
            type={`right`}
            className={`text-current`}
            onClick={goTeamSetting}>
            <MoreVerticalIcon width={24} />
          </Button>
        )}
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
              <div className={`inner`}>
                <div
                  className={`flex justify-between align-items-end mb-[14px] position-absolute right-[20px] top-[16px]`}>
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
                    className={`border-t mt-[16px] pt-[16px] pb-[20px] text-[14px] text-gray10 whitespace-pre-wrap`}>
                    {teamInfo.contents}
                  </div>
                </div>
              </div>
              {/*탭 start*/}
              <Tab.Container
                id="left-tabs-example"
                activeKey={key}
                onSelect={k => setKey(k)}>
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
                        active={() => router.push(`/team/${teamId}/notice`)}
                        className={`pt-[30px] mb-[18px]`}></LinkHeader>

                      {teamNotice.length ? (
                        <Swiper
                          spaceBetween={10}
                          slidesPerView={teamNotice.length === 1 ? 1 : 1.2}
                          className={`pl-[20px]`}>
                          {teamNotice.map(item => (
                            <SwiperSlide key={item.sid}>
                              <NoticeCardItem item={item}></NoticeCardItem>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className={`inner`}>
                          {isLeader ? (
                            <RecommendBtn
                              title={`공지사항을 작성해보세요.`}
                              content={`팀 내 규정 및 매너 수칙 등을 작성하고 멤버들과 공유하세요.`}
                              btnVariant={"gray2"}
                              btnMessage={`글쓰기`}
                              active={() =>
                                router.push(`/team/${teamId}/notice/create`)
                              }></RecommendBtn>
                          ) : (
                            <NoContentText
                              title={`작성된 공지사항이 없습니다.`}></NoContentText>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <LinkHeader
                        title={"경기 일정"}
                        active={() => {}}
                        className={`pt-[50px] mb-[18px]`}></LinkHeader>
                      <div className={`inner`}>
                        {isLeader || isManagement ? (
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
                        ) : (
                          <NoContentText
                            title={`아직 경기 일정이 없습니다.`}></NoContentText>
                        )}
                      </div>
                    </div>
                    <div>
                      <LinkHeader
                        title={"멤버"}
                        className={`pt-[50px] mb-[18px]`}></LinkHeader>
                      <div className={`inner`}>
                        {nowTeamUser && (
                          <div className={`flex flex-column gap-[20px] mb-[40px]`}>
                            {nowTeamUser?.map((item, index) => (
                              <TeamMemberProfile
                                item={item}
                                key={`member-${index}`}></TeamMemberProfile>
                            ))}
                          </div>
                        )}
                        {isMember && (
                          <RecommendBtn
                            title={`새로운 멤버를 초대해 보세요.`}
                            content={`SNS나 문자, 링크로 공유하고 쉽게 초대하세요.`}
                            btnMessage={`멤버 초대하기`}
                            active={shareNowUrl}></RecommendBtn>
                        )}
                        {(isLeader || isManagement) && (
                          <RecommendBtn
                            title={`운영진 멤버를 선정하고 권한을 설정하세요.`}
                            content={`공지사항 작성, 경기 만들기 등 팀의 일을 함께 할 운영진을 선정하고 권한을 설정하세요.`}
                            btnMessage={`팀 설정 관리`}
                            btnVariant={"green-sub"}
                            className={"mt-[10px]"}
                            active={() => {}}></RecommendBtn>
                        )}
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="record">
                    <LinkHeader
                      title={"경기별기록"}
                      className={`pt-[30px] mb-[18px]`}></LinkHeader>
                    <div className={`inner`}>
                      <Nav
                        variant="pills"
                        className={`[&_.nav-link.active]:!bg-green_primary`}
                        defaultActiveKey={COMPETITION_TYPE.ALL}>
                        <Nav.Item>
                          <Nav.Link eventKey={COMPETITION_TYPE.ALL}>전체</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={COMPETITION_TYPE.LEAGUE}>리그</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey={COMPETITION_TYPE.CUP}>컵</Nav.Link>
                        </Nav.Item>
                      </Nav>
                      {teamMatch.length > 0 ? (
                        <div className={`mt-[18px] flex flex-column gap-[10px]`}>
                          {teamMatch.map((match, index) => (
                            <MatchItem match={match} key={`match-${index}`}></MatchItem>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-gray7 text-[14px] text-center mt-[30px]`}>
                          아직 경기 기록이 없습니다.
                        </p>
                      )}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="gallery">
                    <div className={`inner pt-[20px] pb-[80px]`}>
                      {teamGallery.length === 0 ? (
                        <div className={`text-center pt-[80px]`}>
                          <Image
                            width={50}
                            className={`text-gray6 mx-auto mb-[12px]`}></Image>
                          <p className={`text-gray7 text-[14px]`}>
                            멤버들과 사진을 공유하는
                            <br />
                            갤러리입니다.
                          </p>
                        </div>
                      ) : (
                        <ul className={`grid grid-cols-4 gap-[7px]`}>
                          {teamGallery.map((item, index) => (
                            <li
                              key={`gallery-${index}`}
                              className={`w-[100%] position-relative after:content-[''] after:block after:pb-[100%] rounded-[3px] overflow-hidden`}>
                              <img
                                src={item.file_path}
                                alt=""
                                className={`w-full h-full object-cover position-absolute`}
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <FloatAddBtn
                      path={`/team/${teamId}/gallery/create`}
                      text={"등록"}></FloatAddBtn>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
              {/*탭 end*/}
              {user && !isSendJoin && !user.tid && (
                <div className={`bottom-fixed btns bg-white`}>
                  <Button
                    className={`w-full`}
                    variant="green-primary"
                    size="50"
                    onClick={() => joinTeam()}>
                    가입하기
                  </Button>
                </div>
              )}
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
