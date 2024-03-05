import SearchHeader from "@/components/layout/SearchHeader";
import { useRouter } from "next/router";
import Nav from "react-bootstrap/Nav";
import NavBottom from "@/components/layout/NavBottom";
import { useEffect, useState } from "react";
import { sendAnonymousGet } from "@/helper/api";
import CompetitionItem from "@/components/competition/CompetitionItem";
import { Spinner } from "react-bootstrap";
import { removeEmptyObject, replaceQueryPage, getParameter } from "@/helper/UIHelper";
import { COMPETITION_TYPE, COMPETITION_SORTING } from "@/constants/serviceConstants";
import FloatAddBtn from "@/components/btn/FloatAddBtn";

const initialSearch = {
  page: 1,
  limit: 100,
  type: COMPETITION_TYPE.LEAGUE,
  sorting: COMPETITION_SORTING.ALL,
};

export default function Index() {
  const router = useRouter();
  const [competitionList, setCompetitionList] = useState(null);
  const [searchFilter, setSearchFilter] = useState(null);

  useEffect(() => {
    setSearchFilter(prevState => {
      return {
        ...initialSearch,
        ...prevState,
        ...removeEmptyObject({
          page: getParameter("page"),
          limit: getParameter("limit"),
          type: getParameter("type"),
          sorting: getParameter("sorting"),
        }),
      };
    });
  }, [router]);

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
      setCompetitionList(res.data.result.data);
    });
  };

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
        <div className={`mt-[10px]`}>
          {!competitionList ? (
            <div className={"text-center"}>
              <Spinner></Spinner>
            </div>
          ) : !competitionList.length ? (
            <div className={"text-center text-gray8 my-[50px]"}>대회가 없습니다.</div>
          ) : (
            competitionList?.map(item => (
              <div key={item.sid}>
                <CompetitionItem item={item}></CompetitionItem>
              </div>
            ))
          )}
        </div>
        <FloatAddBtn path={"/competition/create"} text={"리그만들기"} isNav></FloatAddBtn>
      </main>
      <NavBottom></NavBottom>
    </div>
  );
}
