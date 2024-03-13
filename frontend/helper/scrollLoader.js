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
  const router = useRouter();

  useEffect(() => {
    // scroll event listener 등록

    window.addEventListener("scroll", handleScroll);

    return () => {
      // scroll event listener 해제
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  useEffect(() => {
    const query = removeEmptyObject({ ...searchFilter });
    const currentQuery = Object.entries(router.query).toString();
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

    if (PAGE * PER_PAGE > limit) {
      return;
    }

    if (scrollTop + clientHeight >= scrollHeight && fetching === false) {
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
