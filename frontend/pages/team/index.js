import { useEffect, useState } from "react";
import { sendAnonymousGet } from "@/helper/api";
import SearchHeader from "@/components/layout/SearchHeader";
import TeamItem from "@/components/team/TeamItem";
import NavBottom from "@/components/layout/NavBottom";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import FloatAddBtn from "@/components/btn/FloatAddBtn";
//스크롤 추후 적용 필요

const searchFilter = {
  current_page: 1,
  per_page: 3,
};

export default function Index() {
  const [teamList, setTeamList] = useState([]);
  const router = useRouter();

  const getTeamList = function () {
    sendAnonymousGet(
      "/api/teams/",
      {
        ...searchFilter,
      },
      res => {
        setTeamList(res.data.teams.data);
      }
    );
  };

  useEffect(() => {
    getTeamList();
  }, []);

  const searchTeam = () => {
    router.push("/team/search");
  };

  // setupInfiniteScroll(() => {
  //   getTeamList();
  // });

  return (
    <div>
      <SearchHeader onSearch={searchTeam}>
        <p type={"left"}>팀</p>
      </SearchHeader>
      <main className={`pb-20`}>
        <div className={`pt-[20px] pb-[50px]`}>
          {!teamList ? (
            <div className={"text-center"}>
              <Spinner></Spinner>
            </div>
          ) : !teamList.length ? (
            <div className={"text-center text-gray8 my-[50px]"}>팀이 없습니다.</div>
          ) : (
            teamList.map((item, index) => (
              <TeamItem key={`team-${index}`} item={item}></TeamItem>
            ))
          )}
        </div>
        <FloatAddBtn path={"/team/create"} text={"팀만들기"} isNav></FloatAddBtn>
      </main>
      <NavBottom></NavBottom>
    </div>
  );
}
