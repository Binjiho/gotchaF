import { useEffect, useState } from "react";
import axios from "axios";
import { sendGet } from "@/helper/api";
import SearchHeader from "@/components/layout/SearchHeader";
import TeamItem from "@/components/team/TeamItem";
import NavBottom from "@/components/layout/NavBottom";

export default function SignIn() {
  const [teamList, setTeamList] = useState([]);

  const getTeamList = function () {
    sendGet("/api/teams/", null, res => {
      setTeamList(res.data.teams);
    });
  };

  useEffect(() => {
    getTeamList();
  }, []);

  const searchTeam = () => {
    console.log("j");
  };

  return (
    <>
      <SearchHeader onSearch={searchTeam}>
        <p type={"left"}>팀</p>
      </SearchHeader>
      <main className={`pb-20`}>
        <div className={`pt-[20px]`}>
          {teamList.map((item, index) => (
            <TeamItem key={`team-${index}`} item={item}></TeamItem>
          ))}
        </div>
      </main>
      <NavBottom></NavBottom>
    </>
  );
}
