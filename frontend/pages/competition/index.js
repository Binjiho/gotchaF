import SearchHeader from "@/components/layout/SearchHeader";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import NavBottom from "@/components/layout/NavBottom";
import { useEffect, useState } from "react";
import { sendAnonymousGet } from "@/helper/api";
import CompetitionItem from "@/components/competition/CompetitionItem";
import { Spinner } from "react-bootstrap";
import { removeEmptyObject, replaceQueryPage, getParameter } from "@/helper/UIHelper";
import {
  COMPETITION_TYPE,
  COMPETITION_SORTING,
  TEAM_MEMBER_LEVEL,
} from "@/constants/serviceConstants";
import FloatAddBtn from "@/components/btn/FloatAddBtn";
import { useSelector } from "react-redux";
import { SetupInfiniteScroll } from "@/helper/scrollLoader";

const initialSearch = {
  page: 1,
  per_page: 10,
  type: COMPETITION_TYPE.LEAGUE,
  sorting: COMPETITION_SORTING.ALL,
};

export default function Index() {
  const router = useRouter();
  const [competitionList, setCompetitionList] = useState([]);
  const [searchFilter, setSearchFilter] = useState(null);
  const user = useSelector(state => state.user);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const query = removeEmptyObject({ ...searchFilter });
    const currentQuery = Object.entries(router.query).toString();
    const newQuery = Object.entries(query).toString();

    if (currentQuery !== newQuery) {
      replaceQueryPage(searchFilter, router);
    } else if (currentQuery) {
      getCompetitionList();
    }
  }, [searchFilter]);

  const searchTeam = () => {
    router.push("/competition/search");
  };

  const changeSearchFilter = (key, value) => {
    setCompetitionList([]);
    setSearchFilter(prevState => {
      return {
        ...prevState,
        [key]: value,
        page: initialSearch.page,
        limit: initialSearch.limit,
      };
    });
  };

  const getCompetitionList = () => {
    sendAnonymousGet(`/api/competitions`, { ...removeEmptyObject(searchFilter) }, res => {
      setCompetitionList([...competitionList, ...res.data.result.data]);
      setLimit(res.data.total_count);
    });
  };

  const isLeader = user.tid && user.level === TEAM_MEMBER_LEVEL.LEADER;

  SetupInfiniteScroll(
    initialSearch,
    searchFilter,
    setSearchFilter,
    limit,
    getCompetitionList
  );

  return (
    <div>
      <SearchHeader onSearch={searchTeam}>
        <div type={"left"} className={`flex gap-[12px] text-gray6`}>
          <p
            className={`cursor-pointer ${
              COMPETITION_TYPE.LEAGUE === Number(searchFilter?.type) ? "text-black" : ""
            }`}
            onClick={() => changeSearchFilter("type", COMPETITION_TYPE.LEAGUE)}>
            리그
          </p>
          <p
            className={`cursor-pointer ${
              COMPETITION_TYPE.CUP === Number(searchFilter?.type) ? "text-black" : ""
            }`}
            onClick={() => changeSearchFilter("type", COMPETITION_TYPE.CUP)}>
            컵
          </p>
        </div>
      </SearchHeader>
      <main className={`inner`}>
        <Nav
          variant="pills"
          className={`mt-[20px]`}
          onSelect={key => changeSearchFilter("sorting", key)}
          activeKey={searchFilter?.sorting}>
          <Nav.Item>
            <Nav.Link eventKey={COMPETITION_SORTING.ALL}>전체</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={COMPETITION_SORTING.PRE}>모집중</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={COMPETITION_SORTING.ING}>진행중</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={COMPETITION_SORTING.END}>종료된</Nav.Link>
          </Nav.Item>
        </Nav>
        <div className={`mt-[10px] pb-[100px]`}>
          {!competitionList ? (
            <div className={"text-center"}>
              <Spinner></Spinner>
            </div>
          ) : !competitionList.length ? (
            <div className={"text-center text-gray8 my-[50px]"}>대회가 없습니다.</div>
          ) : (
            competitionList?.map(item => (
              <CompetitionItem item={item} key={item.sid}></CompetitionItem>
            ))
          )}
        </div>
        {isLeader && (
          <FloatAddBtn
            path={`/competition/create?type=${searchFilter?.type}`}
            text={`${Number(searchFilter?.type) === 1 ? "리그" : "컵"}만들기`}
            isNav></FloatAddBtn>
        )}
      </main>
      <NavBottom></NavBottom>
    </div>
  );
}
