import { useEffect, useState } from "react";
import { sendGet } from "@/helper/api";
import SearchHeader from "@/components/layout/SearchHeader";
import TeamItem from "@/components/team/TeamItem";
import NavBottom from "@/components/layout/NavBottom";
import { Button, Spinner } from "react-bootstrap";
import PlusIcon from "@/public/icons/system/add-line.svg";
import { useRouter } from "next/router";
import { setupInfiniteScroll } from "@/helper/scrollLoader";
//스크롤 추후 적용 필요

const searchFilter = {
  current_page: 1,
  per_page: 3,
};

export default function Index() {
  const [teamList, setTeamList] = useState([]);
  const router = useRouter();

  const getTeamList = function () {
    sendGet(
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
          {!teamList.length && (
            <div className={"text-center"}>
              <Spinner></Spinner>
            </div>
          )}
          {teamList.map((item, index) => (
            <TeamItem key={`team-${index}`} item={item}></TeamItem>
          ))}
        </div>
        <div
          className={`w-full fixed bottom-[82px] flex max-w-[500px] left-[50%] translate-x-[-50%]`}>
          <Button
            className={`bg-green_primary text-white rounded-[23px] h-[46px] pl-[15px] pr-[18px] flex align-items-center shadow-[0px_3px_10px_0px_rgba(0,_0,_0,_0.15)] ml-auto mr-[20px]`}
            onClick={() => router.push("/team/create")}>
            <PlusIcon width={24} />
            <span className={`text-[16px]`}>팀만들기</span>
          </Button>
        </div>
      </main>
      <NavBottom></NavBottom>
    </div>
  );
}
