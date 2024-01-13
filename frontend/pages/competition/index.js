import SearchHeader from "@/components/layout/SearchHeader";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import NavBottom from "@/components/layout/NavBottom";
import { useEffect, useState } from "react";
import { sendAnonymousGet } from "@/helper/api";
import CompetitionItem from "@/components/competition/CompetitionItem";
import { Spinner } from "react-bootstrap";

const COMPETITION_TYPE = {
  LEAGUE: 1,
  CUP: 2,
  1: "LEAGUE",
  2: "CUP",
};

export default function Index() {
  const router = useRouter();
  const [competitionType, setCompetitionType] = useState("");
  const [competitionList, setCompetitionList] = useState([]);

  useEffect(() => {
    setCompetitionType(COMPETITION_TYPE.LEAGUE);
  }, []);

  useEffect(() => {
    let location = {
      query: { type: competitionType },
    };

    router.replace(location, undefined, { shallow: true });

    getCompetitionList();
  }, [competitionType]);

  const searchTeam = () => {
    router.push("/team/search");
  };

  const getCompetitionList = () => {
    sendAnonymousGet(`/api/competitions`, null, res => {
      setCompetitionList(res.data.result.data);
    });
  };

  return (
    <div>
      <SearchHeader onSearch={searchTeam}>
        <div type={"left"} className={`flex gap-[12px] text-gray6`}>
          <p
            className={`cursor-pointer ${
              COMPETITION_TYPE.LEAGUE === Number(competitionType) ? "text-black" : ""
            }`}
            onClick={() => setCompetitionType(COMPETITION_TYPE.LEAGUE)}>
            리그
          </p>
          <p
            className={`cursor-pointer ${
              COMPETITION_TYPE.CUP === Number(competitionType) ? "text-black" : ""
            }`}
            onClick={() => setCompetitionType(COMPETITION_TYPE.CUP)}>
            컵
          </p>
        </div>
      </SearchHeader>
      <main>
        <div className={`mt-[32px]`}>
          {!competitionList.length && (
            <div className={"text-center"}>
              <Spinner></Spinner>
            </div>
          )}
          {competitionList.map(item => (
            <div key={item.sid}>
              <CompetitionItem item={item}></CompetitionItem>
            </div>
          ))}
        </div>
      </main>
      <NavBottom></NavBottom>
    </div>
  );
}
