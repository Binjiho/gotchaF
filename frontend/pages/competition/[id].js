import { Badge, Button, Tab, Nav, Spinner } from "react-bootstrap";
import MoreVerticalIcon from "@/public/icons/system/more-vertical.svg";
import PrevHeader from "@/components/layout/PrevHeader";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import TimeIcon from "@/public/icons/system/time-line.svg";
import EarthLineIcon from "@/public/icons/other/earth-line.svg";
import MapIcon from "@/public/icons/social/map.svg";
import UserLineIcon from "@/public/icons/social/map-pin-user-line.svg";
import TimeLineIcon from "@/public/icons/system/time-line.svg";
import CalendarIcon from "@/public/icons/social/calendar.svg";
import RightCircleIcon from "@/public/icons/system/arrow-right-circle-line.svg";

export default function Id() {
  const router = useRouter();
  const competitionId = router.query.id;
  const [competitionInfo, setCompetitionInfo] = useState({
    sid: 1,
    kind: 0,
    type: 0,
    title: "축구 같이 함",
    contents: "같이 할 사람~~~",
    region: "이게 뭘까",
    limit_person: 4,
    sex: 1,
    file_name: null,
    file_path: null,
    del_yn: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  });
  const user = useSelector(state => state.user);

  const goTeamSetting = () => {
    router.push(`/team/${competitionId}/setting`);
  };

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
              <div className={`pt-[24px] pb-[20px] border-b-[1px] !border-gray3`}>
                <p className={`text-[20px] font-bold mb-[6px]`}>
                  {competitionInfo.title}
                </p>
                <div className={`mt-[8px] flex align-items-center gap-[5px] text-[14px]`}>
                  <div className={`text-red_primary flex align-items-center gap-[5px]`}>
                    <TimeIcon width={16} />
                    <b>D-10</b>
                  </div>
                  <span className={`gap-line`}></span>
                  <p className={`text-gray10`}>12월 18일(수) 모집 마감</p>
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
                    <p>풋살 5:5</p>
                  </li>
                  <li>
                    <MapIcon width={16} />
                    <p>논현동</p>
                  </li>
                  <li>
                    <UserLineIcon width={16} />
                    <p>2/4</p>
                  </li>
                  <li>
                    <CalendarIcon width={16} />
                    <p>주 3회 월,목</p>
                  </li>
                  <li>
                    <TimeLineIcon width={16} />
                    <p>12월 18일 마감</p>
                  </li>
                  <li>
                    <RightCircleIcon width={16} />
                    <p>12월 26일 시작</p>
                  </li>
                </ul>
              </div>

              <Tab.Container id="left-tabs-example" defaultActiveKey="home">
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
                <Tab.Content>
                  <Tab.Pane eventKey="home"></Tab.Pane>
                </Tab.Content>
              </Tab.Container>
              {/*탭 end*/}
              {user && user.tid && (
                <div className={`bottom-fixed btns bg-white`}>
                  <Button className={`w-full`} variant="green-primary" size="50">
                    참가하기
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
