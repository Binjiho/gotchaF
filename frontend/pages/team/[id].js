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
      <PrevHeader transparent={true}></PrevHeader>
      <main className={`position-relative`}>
        <div
          className={`position-absolute left-0 top-0 h-[154px] w-full overflow-hidden`}>
          {teamInfo && (
            <>
              <img
                src={teamInfo.file_path}
                alt=""
                className={`position-absolute w-full h-full object-cover blur-sm`}
              />
              <div
                className={`position-absolute w-full h-full bg-black opacity-50`}></div>
            </>
          )}
        </div>
        {teamInfo && (
          <div className={`pt-[80px] position-relative z-2`}>
            <div className={`flex justify-between align-items-end mb-[14px]`}>
              <div className={`w-[80px] h-[80px] rounded-full overflow-hidden`}>
                <img
                  src={teamInfo.file_path}
                  alt=""
                  className={`w-full h-full object-cover`}
                />
              </div>
              <div className={`flex gap-[12px]`}>
                {[
                  {
                    icon: ShareIcon,
                    evt: null,
                  },
                  {
                    icon: HeartIcon,
                    evt: null,
                  },
                ].map((item, index) => (
                  <Button
                    variant={"text"}
                    className={`text-gray9 flex align-items-center justify-content-center bg-gray2 h-[40px] w-[40px] rounded-full`}
                    key={"btn-" + index}
                    onClick={e => item.evt}>
                    <item.icon width={20}></item.icon>
                  </Button>
                ))}
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
