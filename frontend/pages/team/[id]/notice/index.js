import PrevHeader from "@/components/layout/PrevHeader";
import TodoLineIcon from "@/public/icons/other/todo-line.svg";
import { useEffect, useState } from "react";
import { sendGet } from "@/helper/api";
import { useRouter } from "next/router";
import NoticeItem from "@/components/team/NoticeItem";
import FloatAddBtn from "@/components/btn/FloatAddBtn";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";
import { useSelector } from "react-redux";
import { SetupInfiniteScroll } from "@/helper/scrollLoader";
import { removeEmptyObject } from "@/helper/UIHelper";

const initialSearch = {
  page: 1,
  per_page: 10,
};

export default function Notice({ teamId }) {
  const router = useRouter();
  const [teamNotice, setTeamNotice] = useState([]);
  const user = useSelector(state => state.user);
  const [searchFilter, setSearchFilter] = useState(null);
  const [limit, setLimit] = useState(0);

  const getNotice = function () {
    sendGet(
      `/api/boards/board-notice/${teamId}`,
      { ...removeEmptyObject(searchFilter) },
      res => {
        setTeamNotice([...teamNotice, ...res.data.boards.data]);
        setLimit(res.data.total_count);
      }
    );
  };

  const isLeader = () => {
    const team = Number(teamId) === Number(user.tid);
    const leader = user.level === TEAM_MEMBER_LEVEL.LEADER;

    return user && team && leader;
  };

  SetupInfiniteScroll(initialSearch, searchFilter, setSearchFilter, limit, getNotice);

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          공지사항
        </h2>
      </PrevHeader>
      <main>
        {!teamNotice.length ? (
          <div
            className={`flex flex-column align-items-center justify-center gap-[12px] pt-[100px]`}>
            <TodoLineIcon width={50} className={`text-gray6`}></TodoLineIcon>
            <p className={`text-gray7 text-[14px]`}>아직 공지사항이 없습니다.</p>
          </div>
        ) : (
          <>
            {teamNotice.map(item => (
              <div key={item.sid}>
                <div className={`inner`}>
                  <NoticeItem item={item}></NoticeItem>
                </div>
                <hr className={`hr-line`} />
              </div>
            ))}
            {isLeader() && (
              <FloatAddBtn
                path={`/team/${teamId}/notice/create`}
                text={"글쓰기"}></FloatAddBtn>
            )}
          </>
        )}
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  return { props: { teamId: id } };
}
