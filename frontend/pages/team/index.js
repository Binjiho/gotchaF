import { useEffect, useState } from "react";
import { sendAnonymousGet } from "@/helper/api";
import SearchHeader from "@/components/layout/SearchHeader";
import TeamItem from "@/components/team/TeamItem";
import NavBottom from "@/components/layout/NavBottom";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import FloatAddBtn from "@/components/btn/FloatAddBtn";
import { useSelector } from "react-redux";
import { SetupInfiniteScroll } from "@/helper/scrollLoader";
import { removeEmptyObject, getParameter, replaceQueryPage } from "@/helper/UIHelper";

const initialSearch = {
  page: 1,
  per_page: 7,
};

export default function Index() {
  const [teamList, setTeamList] = useState([]);
  const router = useRouter();
  const user = useSelector(state => state.user);
  const [searchFilter, setSearchFilter] = useState(null);
  const [limit, setLimit] = useState(10);

  const getTeamList = function () {
    sendAnonymousGet("/api/teams/", { ...removeEmptyObject(searchFilter) }, res => {
      setTeamList([...teamList, ...res.data.teams.data]);
    });
  };

  const searchTeam = () => {
    router.push("/team/search");
  };

  SetupInfiniteScroll(initialSearch, searchFilter, setSearchFilter, limit, getTeamList);

  return (
    <div>
      <SearchHeader onSearch={searchTeam}>
        <p type={"left"}>팀</p>
      </SearchHeader>
      <main className={`pb-20 inner`}>
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
        {!user.tid && (
          <FloatAddBtn path={"/team/create"} text={"팀만들기"} isNav></FloatAddBtn>
        )}
      </main>
      <NavBottom></NavBottom>
    </div>
  );
}
