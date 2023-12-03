import { useEffect, useState } from "react";
import { sendGet } from "@/helper/api";
import SearchHeader from "@/components/layout/SearchHeader";
import TeamItem from "@/components/team/TeamItem";
import NavBottom from "@/components/layout/NavBottom";
import { Button, Spinner } from "react-bootstrap";
import PlusIcon from "@/public/icons/system/add-line.svg";
import { useRouter } from "next/router";

export default function Index() {
  const [teamList, setTeamList] = useState([]);
  const router = useRouter();

  const getTeamList = function () {
    sendGet("/api/teams/", null, res => {
      setTeamList(res.data.teams);
    });
  };

  useEffect(() => {
    getTeamList();
  }, []);

  const searchTeam = () => {
    router.push("/team/search");
  };

  return (
    <>
      <SearchHeader onSearch={searchTeam}>
        <p type={"left"}>팀</p>
      </SearchHeader>
      <main className={`pb-20`}>
        <div className={`pt-[20px]`}>
          {!teamList.length && (
            <div className={"text-center"}>
              <Spinner></Spinner>
            </div>
          )}
          {teamList.map((item, index) => (
            <TeamItem key={`team-${index}`} item={item}></TeamItem>
          ))}
        </div>
        <Button
          className={`bg-green_primary text-white rounded-[23px] h-[46px] pl-[15px] pr-[18px] flex align-items-center shadow-[0px_3px_10px_0px_rgba(0,_0,_0,_0.15)] fixed right-[20px] bottom-[82px]`}
          onClick={() => router.push("/team/create")}>
          <PlusIcon width={24} />
          <span className={`text-[16px]`}>팀만들기</span>
        </Button>
      </main>
      <NavBottom></NavBottom>
    </>
  );
}
