import { useState } from "react";
import { sendAnonymousPost } from "@/helper/api";
import TeamItem from "@/components/team/TeamItem";
import { Form, InputGroup } from "react-bootstrap";
import PrevHeader from "@/components/layout/PrevHeader";
import SearchIcon from "@/public/icons/tool/search.svg";

export default function Search() {
  const [teamList, setTeamList] = useState([]);
  const [title, setTitle] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const getTeamList = function () {
    const data = {
      title: title,
    };

    sendAnonymousPost("/api/teams/searchTeams/", data, res => {
      setTeamList(res.data.teams);
      setIsSearch(true);
    });
  };

  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={`pb-20 inner`}>
        <Form className={`pt-2`}>
          <InputGroup>
            <InputGroup.Text id="basic-addon1" className={`pr-0 pl-[15px] !bg-gray2`}>
              <SearchIcon width={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="팀명을 검색해보세요."
              aria-describedby="basic-addon1"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  getTeamList();
                }
              }}
              className={`border-l-0 !py-[15px] !pl-[10px] bg-gray2 [&:focus]:bg-gray2`}
            />
          </InputGroup>
        </Form>
        <div className={`pt-[20px]`}>
          {teamList.map((item, index) => (
            <TeamItem key={`team-${index}`} item={item}></TeamItem>
          ))}
          {isSearch && !teamList.length && (
            <p className={`text-gray9 text-center`}>검색 결과가 없습니다.</p>
          )}
        </div>
      </main>
    </>
  );
}
