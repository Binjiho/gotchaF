import { Badge, Button, Tab, Nav, Spinner } from "react-bootstrap";
import MoreVerticalIcon from "@/public/icons/system/more-vertical.svg";
import PrevHeader from "@/components/layout/PrevHeader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeIcon from "@/public/icons/system/time-line.svg";
import EarthLineIcon from "@/public/icons/other/earth-line.svg";
import MapIcon from "@/public/icons/social/map.svg";
import UserLineIcon from "@/public/icons/social/map-pin-user-line.svg";
import TimeLineIcon from "@/public/icons/system/time-line.svg";
import CalendarIcon from "@/public/icons/social/calendar.svg";
import RightCircleIcon from "@/public/icons/system/arrow-right-circle-line.svg";
import { sendAnonymousGet, sendPost } from "@/helper/api";
import {
  COMPETITION_KIND,
  COMPETITION_TYPE,
  TEAM_MEMBER_LEVEL,
} from "@/constants/serviceConstants";
import { printDateTimeFormat } from "@/helper/value";
import { convertWeek, calculateDday } from "@/helper/UIHelper";
import TimeBadge from "@/components/competition/TimeBadge";
import TeamProfile from "@/components/team/TeamProfile";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import RoundItem from "@/components/competition/RoundItem";
import RoundProfile from "@/components/image/RoundProfile";
import CupRankItem from "@/components/competition/CupRankItem";
import ConsultItem from "@/components/competition/ConsultItem";
import FloatAddBtn from "@/components/btn/FloatAddBtn";
import { toast } from "react-toastify";

export default function Id() {
  const router = useRouter();
  const competitionId = router.query.id;
  const [competitionInfo, setCompetitionInfo] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const [rankInfo, setRankInfo] = useState(null);
  const [consultList, setConsultList] = useState(null);
  const user = useSelector(state => state.user);
  const [key, setKey] = useState("home");
  const isLeague = Number(competitionInfo?.type) === COMPETITION_TYPE.LEAGUE;
  const isCup = Number(competitionInfo?.type) === COMPETITION_TYPE.CUP;

  const countDivisionsByTwo = number => {
    let count = 0;
    while (number >= 2) {
      number /= 2;
      count++;
    }
    return count + 1;
  };

  const getCompetition = function () {
    sendAnonymousGet(`/api/competitions/detail/${competitionId}`, null, res => {
      setCompetitionInfo(res.data.result);
    });
  };

  const getMatches = () => {
    sendAnonymousGet(`/api/matches/${competitionId}`, null, res => {
      const match = res.data.result;
      let round = 1;
      let matchList = [];

      match.map(item => {
        if (
          matchList.length &&
          matchList[matchList.length - 1].round === Number(item.round)
        ) {
          matchList[matchList.length - 1].list.push(item);
        } else if (round === Number(item.round)) {
          matchList.push({
            round: Number(item.round),
            list: [item],
          });
        } else {
          round += 1;

          matchList.push({
            round: Number(item.round),
            list: [item],
          });
        }
      });

      setMatchInfo(matchList);
    });
  };

  const getRank = () => {
    sendAnonymousGet(`/api/matches/ranking/${competitionId}`, null, res => {
      const result = res.data.result;

      if (isLeague) {
        setRankInfo(result);
      } else if (isCup) {
        let rankList = [];
        let round = 1;
        let order = 1;

        result.map(item => {
          if (round < item.round) {
            round = Number(item.round);
            order = 1;
          }

          if (round === Number(item.round)) {
            if (!rankList[round - 1]) {
              rankList.push([]);
            }

            if (order < Number(item.order)) {
              for (let i = order; i < item.order; i++) {
                rankList[round - 1].push([{ order: i, round: item.round }]);
              }
              order = Number(item.order);
              return;
            }

            rankList[round - 1].push(item);
            order += 1;
          }
        });

        const calNull = countDivisionsByTwo(rankList[0].length) - rankList.length;

        if (calNull) {
          let roundLength = rankList[rankList.length - 1].length / 2;

          for (let i = 0; i < calNull; i++) {
            rankList.push(
              new Array(roundLength).fill({
                round: rankList.length + 1,
              })
            );

            roundLength = roundLength / 2;
          }
        }

        setRankInfo(rankList);
      }
    });
  };

  const getNotice = () => {
    sendAnonymousGet(`/api/boards/board-inquire/${competitionId}`, null, res => {
      setConsultList(res.data.result);
    });
  };

  const goTeamSetting = () => {
    router.push(`/team/${competitionId}/setting`);
  };

  useEffect(() => {
    if (!competitionId) return;
    getCompetition();
  }, [competitionId]);

  useEffect(() => {
    if (key === "competition") {
      getMatches();
    } else if (key === "rank") {
      getRank();
    } else if (key === "consult") {
      getNotice();
    }
  }, [key]);

  const joinCompetition = () => {
    sendPost(`/api/competitions/apply/${competitionId}`, null, res => {
      if (res.data?.result?.sid) {
        toast("참가 신청이 되었습니다.");
        getCompetition();
      }
    });
  };

  const startCompetition = () => {
    sendPost(`/api/competitions/start/${competitionId}`, null, res => {
      toast("경기가 시작되었습니다.");
    });
  };

  const isValidJoin = () => {
    const isTeam = competitionInfo.join_teams.find(
      team => Number(team.tid) === Number(user.tid)
    );

    return user && !isTeam && key !== "consult";
  };

  const isLeader = () => {
    const team = Number(competitionInfo.tid) === Number(user.tid);
    const leader = user.level === TEAM_MEMBER_LEVEL.LEADER;

    return user && team && leader && key !== "consult";
  };

  const isStart = competitionInfo?.start === "S";

  return (
    <>
      <PrevHeader transparent={true}>
        <Button
          variant={`text`}
          type={`right`}
          className={`text-current`}
          onClick={goTeamSetting}>
          <MoreVerticalIcon width={24} />
        </Button>
      </PrevHeader>
      <main className={`position-relative`}>
        <div
          className={`position-absolute left-0 top-0 h-[154px] w-full overflow-hidden bg-gray-50`}>
          {competitionInfo && (
            <>
              <img
                src={competitionInfo.file_path}
                alt=""
                className={`position-absolute w-full h-full object-cover`}
              />
            </>
          )}
        </div>
        <div className={`mt-[106px] position-relative z-2`}>
          {competitionInfo ? (
            <>
              <div className={`inner`}>
                <div className={`pt-[24px] pb-[20px] border-b-[1px] !border-gray3`}>
                  <p className={`text-[20px] font-bold mb-[6px]`}>
                    {competitionInfo.title}
                  </p>
                  <div
                    className={`mt-[8px] flex align-items-center gap-[5px] text-[14px]`}>
                    {calculateDday(competitionInfo.regist_edate) > 0 ? (
                      <>
                        <div
                          className={`text-red_primary flex align-items-center gap-[5px]`}>
                          <TimeIcon width={16} />
                          <b>D-{calculateDday(competitionInfo.regist_edate)}</b>
                        </div>
                        <span className={`gap-line`}></span>
                        <p className={`text-gray10`}>
                          {printDateTimeFormat(
                            competitionInfo.regist_edate,
                            "MM월 dd일(E) "
                          )}
                          모집 마감
                        </p>
                      </>
                    ) : (
                      <TimeBadge
                        eventStart={competitionInfo.event_sdate}
                        eventEnd={competitionInfo.event_edate}
                        limit={competitionInfo.limit_team}
                        teamCount={competitionInfo.team_count}></TimeBadge>
                    )}
                  </div>
                </div>
                <div className={`mb-[20px]`}>
                  <p className={`mb-[13px] text-gray8 text-[13px] mt-[18px]`}>
                    자세한 정보
                  </p>
                  <ul
                    className={`[&>li]:flex [&>li]:align-items-center [&>li]:gap-[8px] [&>li]:w-[152px] max-w-[327px] flex justify-between flex-wrap text-[15px] text-gray10 gap-[10px] font-medium
                `}>
                    <li>
                      <EarthLineIcon width={16} />
                      <p>
                        {COMPETITION_KIND[competitionInfo.kind]}{" "}
                        {competitionInfo.person_vs}
                      </p>
                    </li>
                    <li>
                      <MapIcon width={16} />
                      <p>{competitionInfo.region}</p>
                    </li>
                    <li>
                      <UserLineIcon width={16} />
                      <p>
                        <span className={`text-green_primary`}>
                          {competitionInfo.team_count}
                        </span>
                        /{competitionInfo.limit_team}
                      </p>
                    </li>
                    <li>
                      <CalendarIcon width={16} />
                      <p>
                        {competitionInfo.frequency} {convertWeek(competitionInfo.yoil)}
                      </p>
                    </li>
                    <li>
                      <TimeLineIcon width={16} />
                      <p>
                        {printDateTimeFormat(competitionInfo.event_edate, "MM월 dd일")}{" "}
                        마감
                      </p>
                    </li>
                    <li>
                      <RightCircleIcon width={16} />
                      <p>
                        {printDateTimeFormat(competitionInfo.event_sdate, "MM월 dd일")}{" "}
                        시작
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <Tab.Container
                id="left-tabs-example"
                activeKey={key}
                onSelect={k => setKey(k)}>
                <Nav variant="underline">
                  <Nav.Item>
                    <Nav.Link eventKey="home">홈</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="competition">경기</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="rank">랭킹</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="consult">문의</Nav.Link>
                  </Nav.Item>
                </Nav>
                <hr className={`hr-line`} />
                <Tab.Content
                  className={
                    "[&>div]:pt-[30px] [&>div]:pb-[60px] [&_h3]:text-[18px] [&_h3]:font-bold"
                  }>
                  <Tab.Pane eventKey="home">
                    <div className={`inner`}>
                      <h3>참가팀</h3>
                      <div className={`mt-[18px] pb-[12px] border-b-[1px] !border-gray3`}>
                        <TeamProfile
                          size={"big"}
                          item={competitionInfo.join_teams[0]}></TeamProfile>
                      </div>
                      <div className={`pt-[12px] flex flex-column gap-[12px]`}>
                        <span className={`text-[#A2A6A9] text-[13px]`}>
                          {competitionInfo.join_teams.length}팀 참가중
                        </span>
                        {competitionInfo.join_teams.map(item => {
                          return (
                            <TeamProfile
                              item={item}
                              key={`team-${item.tid}`}></TeamProfile>
                          );
                        })}
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="competition" className={"inner"}>
                    <Swiper
                      modules={[Navigation]}
                      navigation
                      className={`swiper-custom-btn size-24 [&_.swiper-button-next]:top-[27px] [&_.swiper-button-prev]:top-[27px]`}>
                      {matchInfo?.map((item, index) => (
                        <SwiperSlide key={`match-${index}`}>
                          <RoundItem item={item}></RoundItem>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Tab.Pane>
                  <Tab.Pane eventKey="rank">
                    <div>
                      <div className={`inner`}>
                        <h3>
                          {isLeague ? "리그 " : isCup ? "컵 " : ""}
                          랭킹
                        </h3>
                      </div>
                      {isLeague ? (
                        <table className={`league-rank-table mt-[20px]`}>
                          <thead>
                            <tr>
                              <th>팀</th>
                              <th>경기</th>
                              <th>승점</th>
                              <th>승</th>
                              <th>무</th>
                              <th>패</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rankInfo?.map((rank, index) => {
                              return (
                                <tr key={`rank-${index}`}>
                                  <td className={`team`}>
                                    <b>{index + 1}</b>
                                    <RoundProfile
                                      img={rank.thum}
                                      size={24}></RoundProfile>
                                    <span>{rank.title}</span>
                                  </td>
                                  <td>{rank.step}</td>
                                  <td>{rank.tot_score}</td>
                                  <td>{rank.w_cnt}</td>
                                  <td>{rank.d_cnt}</td>
                                  <td>{rank.l_cnt}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : isCup ? (
                        <div className={`cup-rank-table mt-[20px]`}>
                          {rankInfo?.map((round, roundIdx) => {
                            return (
                              <ul key={`round-${roundIdx}`}>
                                {round.map((rank, index) => {
                                  return (
                                    <li key={`rank-${roundIdx}-${index}`}>
                                      <CupRankItem rank={rank}></CupRankItem>
                                    </li>
                                  );
                                })}
                              </ul>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="consult">
                    <div className={`inner pb-[13px] border-b-[1px] !border-gray3`}>
                      <h3>
                        게시글{" "}
                        <span className={`text-green_primary`}>
                          {consultList?.length || ""}
                        </span>
                      </h3>
                    </div>
                    {consultList?.map((consult, index) => {
                      return (
                        <div key={`consult-${index}`}>
                          <div className={`inner`}>
                            <ConsultItem item={consult}></ConsultItem>
                          </div>
                          <hr className={`hr-line`} />
                        </div>
                      );
                    })}
                    <FloatAddBtn
                      path={`/competition/${competitionId}/consult/create`}
                      text={"문의하기"}></FloatAddBtn>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
              {/*탭 end*/}
              {isLeader() && !isStart ? (
                <Button
                  className={`w-full`}
                  variant="green-primary"
                  size="50"
                  onClick={startCompetition}>
                  대회시작
                </Button>
              ) : isValidJoin() ? (
                <div className={`bottom-fixed btns bg-white flex`}>
                  <Button
                    className={`w-full`}
                    variant="green-primary"
                    size="50"
                    onClick={joinCompetition}>
                    참가하기
                  </Button>
                </div>
              ) : (
                ""
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
