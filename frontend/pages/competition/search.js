import { useState } from "react";
import { sendAnonymousPost } from "@/helper/api";
import { Form, InputGroup } from "react-bootstrap";
import PrevHeader from "@/components/layout/PrevHeader";
import SearchIcon from "@/public/icons/tool/search.svg";
import CompetitionItem from "@/components/competition/CompetitionItem";

export default function Search() {
  const [competitionList, setCompetitionList] = useState([]);
  const [title, setTitle] = useState("");
  const [isSearch, setIsSearch] = useState(false);

  const getCompetitionList = function () {
    const data = {
      search: title,
    };

    sendAnonymousPost("/api/competitions/search/", data, res => {
      setCompetitionList(res.data.result.data);
      setIsSearch(true);
    });
  };

  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={`pb-20`}>
        <Form className={`pt-2`}>
          <InputGroup>
            <InputGroup.Text id="basic-addon1" className={`pr-0 pl-[15px] !bg-gray2`}>
              <SearchIcon width={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="리그나 컵명을 검색해보세요."
              aria-describedby="basic-addon1"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  getCompetitionList();
                }
              }}
              className={`border-l-0 !py-[15px] !pl-[10px] bg-gray2 [&:focus]:bg-gray2`}
            />
          </InputGroup>
        </Form>
        <div className={`pt-[20px]`}>
          {competitionList.map((item, index) => (
            <CompetitionItem key={`team-${index}`} item={item}></CompetitionItem>
          ))}
          {isSearch && !competitionList.length && (
            <p className={`text-gray9 text-center`}>검색 결과가 없습니다.</p>
          )}
        </div>
      </main>
    </>
  );
}
