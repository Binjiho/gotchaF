import { useEffect, useState } from "react";
import { sendGet } from "@/helper/api";
import { useRouter } from "next/router";
import PrevHeader from "@/components/layout/PrevHeader";
import { Badge, Button } from "react-bootstrap";
import { SEX_TYPE } from "@/constants/serviceConstants";
import ShareIcon from "@/public/icons/social/share-line.svg";
import HeartIcon from "@/public/icons/social/heart-line.svg";

export default function Id() {
  const router = useRouter();
  const [teamInfo, setTeamInfo] = useState(null);
  const [teamUser, setTeamUser] = useState([]);
  const teamId = router.query.id;

  const getTeam = function () {
    sendGet(`/api/teams/${teamId}`, null, res => {
      setTeamInfo(res.data.team_info[0]);
      setTeamUser(res.data.team_user);
    });
  };

  useEffect(() => {
    if (!teamId) return;
    getTeam();
  }, [teamId]);

  return (
    <>
      <PrevHeader></PrevHeader>
      <main>
        <div>
          <img src="" alt="" />
        </div>
        {teamInfo && (
          <div>
            <div>
              <img src="" alt="" />
              <div>
                <Button variant={"text"} className={`text-gray9`}>
                  <ShareIcon width={24}></ShareIcon>
                </Button>
                <Button variant={"text"} className={`text-gray9`}>
                  <HeartIcon width={24}></HeartIcon>
                </Button>
              </div>
            </div>
            <div>
              <p>{teamInfo.title}</p>
              <ul className={`flex gap-[3px] text-[12px] align-items-center`}>
                <li>{teamInfo.region}</li>
                <li className={`gap-line`}></li>
                <li className={`text-gray8`}>멤버 {teamInfo.limit_person}</li>
              </ul>
              <div className={`flex gap-[5px] mt-1`}>
                <Badge pill bg="secondary" size={12}>
                  {SEX_TYPE[teamInfo.sex]}
                </Badge>
                <Badge pill bg="secondary">
                  {`${teamInfo.min_age}~${teamInfo.max_age}세`}
                </Badge>
                <Badge pill bg="primary">
                  모집중
                </Badge>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
