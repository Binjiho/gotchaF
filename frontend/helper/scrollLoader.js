import { useEffect, useState } from "react";
import { getParameter, removeEmptyObject, replaceQueryPage } from "@/helper/UIHelper";
import { useRouter } from "next/router";

const PAGE_STATE = {
  PAGE: "page",
  PER_PAGE: "per_page",
};

export function SetupInfiniteScroll(
  initialSearch,
  searchFilter,
  setSearchFilter,
  limit,
  scrollFunction
) {
  const [fetching, setFetching] = useState(false); // 추가 데이터를 로드하는지 아닌지를 담기위한 state
  const [totalCount, setTotalCount] = useState(0); // 추가 데이터를 로드하는지 아닌지를 담기위한 state
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalCount]);

  useEffect(() => {
    setTotalCount(limit);
  }, [limit, searchFilter]);

  useEffect(() => {
    setSearchFilter(prevState => {
      return {
        ...initialSearch,
        ...prevState,
        ...removeEmptyObject({
          page: getParameter("page"),
          per_page: getParameter("per_page"),
        }),
      };
    });
  }, [router]);

  //새로고침 시
  useEffect(() => {
    if (performance.navigation.type === 1) {
      setSearchFilter(prevState => {
        return {
          ...initialSearch,
          ...prevState,
          ...removeEmptyObject({
            page: 1,
            per_page: getParameter("per_page"),
          }),
        };
      });
    }
  }, []);

  useEffect(() => {
    const query = removeEmptyObject({ ...searchFilter });
    const url = new URL(router.asPath, "https://example.com");

    const queryParams = {};
    for (const [key, value] of url.searchParams.entries()) {
      queryParams[key] = value;
    }

    const currentQuery = Object.entries(queryParams).toString();
    const newQuery = Object.entries(query).toString();

    if (currentQuery !== newQuery) {
      replaceQueryPage(searchFilter, router);
    } else if (currentQuery) {
      scrollFunction();
    }
  }, [searchFilter]);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    const PAGE = Number(getParameter(PAGE_STATE.PAGE));
    const PER_PAGE = Number(getParameter(PAGE_STATE.PER_PAGE));

    if (PAGE * PER_PAGE > totalCount) {
      return;
    }
    if (scrollTop + clientHeight + 10 >= scrollHeight && fetching === false) {
      // 페이지 끝에 도달하면 추가 데이터를 받아온다
      success();
    }
  };

  const success = () => {
    setFetching(true);
    const PAGE = Number(getParameter(PAGE_STATE.PAGE)) + 1;
    const PER_PAGE = Number(getParameter(PAGE_STATE.PER_PAGE));

    setSearchFilter(prevFilter => ({
      ...prevFilter,
      page: PAGE,
      per_page: PER_PAGE,
    }));

    scrollFunction();
    setFetching(false);
  };
}
