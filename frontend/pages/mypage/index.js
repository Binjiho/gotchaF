import { Badge, Button } from "react-bootstrap";
import NavBottom from "@/components/layout/NavBottom";
import SearchHeader from "@/components/layout/SearchHeader";
import { sendGet } from "@/helper/api";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import UserIcon from "@/public/icons/social/user_line.svg";
import SettingIcon from "@/public/icons/tool/settings.svg";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MyScoreList from "@/components/competition/MyScoreList";
import RightIcon from "@/public/icons/system/arrow-right-s-line.svg";
import CupIcon from "@/public/icons/social/cup_line.svg";
import LeagueIcon from "@/public/icons/social/league_line.svg";
import TeamIcon from "@/public/icons/social/team_line.svg";
import { COMPETITION_TYPE, CUP_STATE } from "@/constants/serviceConstants";
import MyCompetition from "@/components/competition/MyCompetition";

export default function Index() {
  const router = useRouter();
  const user = useSelector(state => state.user);
  const [myTeam, setMyTeam] = useState(null);
  const [myTeamRank, setMyTeamRank] = useState([]);
  const [myTeamMatch, setMyTeamMatch] = useState([]);

  const getMyInfo = async () => {
    sendGet(`/api/mypage/detail`, {}, res => {
      setMyTeam(res.data.myteam);

      const rankArr = Object.keys(res.data.myteam_ranks).map(
        item => res.data.myteam_ranks[item]
      );
      setMyTeamRank(rankArr);
      setMyTeamMatch(res.data.mymatch);
    });
  };

  useEffect(() => {
    getMyInfo();
  }, []);

  const userEdit = () => {
    router.push("/mypage/edit");
  };

  const goMyMatch = match => {
    router.push(`/competition/${match.sid}`);
  };

  return (
    <>
      <SearchHeader>
        <p type={"left"}>마이페이지</p>
      </SearchHeader>
      <main className={`pb-[80px] inner`}>
        {!user?.sid ? (
          <>
            <div className={`flex align-items-center my-[30px]`}>
              <div
                className={`bg-gray3 text-gray6 flex align-items-center justify-center w-[62px] h-[62px] rounded-[3px]`}>
                <UserIcon width={24}></UserIcon>
              </div>
              <p className={`text-[18px] font-bold ml-[16px]`}>로그인이 필요합니다</p>
            </div>
            <div className={`grid grid-cols-2 gap-[7px]`}>
              <Button
                variant="green-primary-line"
                size={50}
                onClick={() => router.push("/auth/signin")}>
                로그인
              </Button>
              <Button
                variant="green-primary"
                size={50}
                onClick={() => router.push("/auth/signin")}>
                회원가입
              </Button>
            </div>
          </>
        ) : (
          <>
            <div
              className={`flex align-items-center mt-[30px] pb-[20px] border-b-[1px] !border-b-gray3`}>
              <div
                className={`bg-gray3 text-gray6 flex align-items-center justify-center w-[62px] h-[62px] rounded-[3px] overflow-hidden`}>
                {user.file_path ? (
                  <img
                    src={user.file_path}
                    alt=""
                    className={`object-cover w-full h-full`}
                  />
                ) : (
                  <UserIcon width={24}></UserIcon>
                )}
              </div>
              <div className={`ml-[16px]`}>
                <div className={`mb-[4px] flex align-items-center gap-[9px]`}>
                  <p className={`text-[18px] font-bold`}>{user.name}</p>
                  <Badge bg="secondary" size={12} className={`mt-[2px]`}>
                    공격수
                  </Badge>
                </div>
                <p className={`text-[13px] text-gray7`}>{user.email}</p>
              </div>
              <Button
                variant={`text`}
                className={`!p-[10px] ml-auto text-gray6`}
                onClick={userEdit}>
                <SettingIcon width={20}></SettingIcon>
              </Button>
            </div>
            <div className={`mt-[20px]`}>
              <h3 className={`text-[16px] font-bold pb-[10px]`}>내 경기 일정</h3>
              {myTeamMatch.length ? (
                <MyCompetition match={myTeamMatch}></MyCompetition>
              ) : (
                <div
                  className={`text-green_sub2 bg-[#2AC670]/10 py-[13px] px-[25px] font-bold rounded-[5px]`}>
                  {myTeam
                    ? "아직 경기가 없습니다. 우리팀 경기에 참여해보세요!"
                    : "팀을 만들거나 팀에 가입해 같차를 시작해보세요!"}
                </div>
              )}
            </div>
            {/*  팀  */}
            <div className={`mt-[40px]`}>
              <h3 className={`text-[16px] font-bold pb-[10px]`}>내 팀 경기</h3>
              <ul className={`flex flex-column gap-[10px]`}>
                {myTeam ? (
                  myTeamRank.map(match => {
                    return (
                      <li
                        className={`bg-gray1 rounded-[5px] cursor-pointer`}
                        key={`match-${match.sid}`}
                        onClick={() => goMyMatch(match)}>
                        <div
                          className={`py-[16px] px-[20px] border-b-[1px] !border-gray4 flex justify-between align-items-center`}>
                          <div
                            className={`w-[30px] h-[30px] bg-gray7 rounded-[5px] text-white flex align-items-center justify-center overflow-hidden ${
                              Number(match.type) === COMPETITION_TYPE.LEAGUE
                                ? "bg-blue_primary"
                                : "bg-yellow_sub1"
                            }`}>
                            {Number(match.type) === COMPETITION_TYPE.LEAGUE ? (
                              <LeagueIcon width={17}></LeagueIcon>
                            ) : (
                              <CupIcon width={17}></CupIcon>
                            )}
                          </div>
                          <p
                            className={`ml-[12px] mr-auto text-[15px] font-medium text-gray10`}>
                            {match.title}
                          </p>
                          <button className={`text-gray7`}>
                            <RightIcon width={20}></RightIcon>
                          </button>
                        </div>
                        {Number(match.type) === COMPETITION_TYPE.LEAGUE ? (
                          <MyScoreList
                            list={[
                              { title: "승", score: match?.w_cnt || 0 },
                              { title: "무", score: match?.d_cnt || 0 },
                              { title: "패", score: match?.l_cnt || 0 },
                              {
                                title: "RANK",
                                score: match?.step
                                  ? `${match?.rank}/${match?.step}`
                                  : "-",
                              },
                            ]}></MyScoreList>
                        ) : (
                          <MyScoreList
                            list={[
                              { title: "승", score: match?.w_cnt || 0 },
                              { title: "패", score: match?.l_cnt || 0 },
                              {
                                title: `${
                                  CUP_STATE[match.state] === "LOSE" ? "패배" : "진출"
                                }`,
                                score: `???`,
                              },
                            ]}></MyScoreList>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className={`bg-gray1 rounded-[5px] cursor-pointer`}>
                    <div
                      className={`py-[16px] px-[20px] border-b-[1px] !border-gray4 flex justify-between align-items-center`}>
                      <div
                        className={`w-[30px] h-[30px] bg-gray7 rounded-[5px] text-white flex align-items-center justify-center overflow-hidden`}>
                        <TeamIcon width={17}></TeamIcon>
                      </div>
                      <p
                        className={`ml-[12px] mr-auto text-[15px] font-medium text-gray10`}>
                        아직 소속된 팀이 없습니다.
                      </p>
                    </div>
                    <MyScoreList
                      list={[
                        { title: "승", score: 0 },
                        { title: "무", score: 0 },
                        { title: "패", score: 0 },
                        {
                          title: "TOTAL",
                          score: 0,
                        },
                      ]}></MyScoreList>
                  </li>
                )}
              </ul>
            </div>
            {/*<div className={`mt-[40px]`}>*/}
            {/*  <h3 className={`text-[16px] font-bold pb-[10px]`}>내 기록</h3>*/}
            {/*  <MyScoreList*/}
            {/*    list={[*/}
            {/*      { title: "경기", score: 6 },*/}
            {/*      { title: "득점", score: 1 },*/}
            {/*      { title: "도움", score: 3 },*/}
            {/*      { title: "TOTAL", score: 10 },*/}
            {/*    ]}></MyScoreList>*/}
            {/*</div>*/}
          </>
        )}
      </main>
      <NavBottom></NavBottom>
    </>
  );
}
