import PrevHeader from "@/components/layout/PrevHeader";
import EditItem from "@/components/team/EditItem";
import EditLabel from "@/components/team/EditLabel";
import { useRouter } from "next/router";
import { useModal } from "@/context/ModalContext";
import { sendPost } from "@/helper/api";
import { toast } from "react-toastify";
import { TEAM_MEMBER_LEVEL } from "@/constants/serviceConstants";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/actions/userActions";
import { setCookie } from "@/helper/cookies";

export default function Setting() {
  const router = useRouter();
  const teamId = router.query.id;
  const { openModal } = useModal();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const transConfirm = item => {
    const modalContent = (
      <div className={`text-center`}>
        <strong className={`text-[18px]`}>팀을 삭제하시겠습니까?</strong>
        <p className={`text-[14px] mt-[10px]`}>삭제 후에는 복구가 불가능합니다.</p>
      </div>
    );

    openModal(
      modalContent,
      async () => {
        await deleteTeam(item);
      },
      () => {
        return;
      }
    );
  };

  const isLeader = () => {
    const team = Number(teamId) === Number(user.tid);
    const leader = user.level === TEAM_MEMBER_LEVEL.LEADER;

    return user && team && leader;
  };

  const deleteTeam = () => {
    sendPost(
      `/api/teams/delete-team/${teamId}`,
      null,
      res => {
        toast("팀이 삭제되었습니다");
        setCookie(
          "user",
          JSON.stringify({
            ...user,
            tid: null,
          }),
          7
        );
        dispatch(
          setUser({
            ...user,
            tid: null,
          })
        );
        router.push("/team");
      },
      () => {}
    );
  };

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          팀 설정
        </h2>
      </PrevHeader>
      <main>
        {isLeader() && (
          <>
            <EditLabel title={"팀 기본 정보 관리"}></EditLabel>
            <div className={`inner`}>
              <EditItem
                title={`팀 설정`}
                style={`border-none`}
                onButtonClick={() => router.push(`/team/${teamId}/edit`)}></EditItem>
            </div>
            <EditLabel title={"멤버 가입 관리"}></EditLabel>
            <div className={`inner`}>
              <EditItem
                title={`가입대기리스트`}
                onButtonClick={() => router.push(`/team/${teamId}/edit/join`)}></EditItem>
            </div>
          </>
        )}
        <EditLabel title={"멤버 활동 관리"}></EditLabel>
        <div className={`inner`}>
          <EditItem
            title={`멤버 탈퇴`}
            onButtonClick={() => router.push(`/team/${teamId}/edit/quit`)}></EditItem>
          <EditItem
            title={`운영진 관리`}
            onButtonClick={() =>
              router.push(`/team/${teamId}/edit/management`)
            }></EditItem>
          {isLeader() && (
            <EditItem
              title={`리더 양도`}
              style={`border-none`}
              onButtonClick={() => router.push(`/team/${teamId}/edit/leader`)}></EditItem>
          )}
        </div>
        {isLeader() && (
          <>
            <hr className={`hr-line`} />
            <div className={`inner`}>
              <EditItem
                title={`팀 삭제하기`}
                style={`text-red_primary`}
                onButtonClick={transConfirm}></EditItem>
            </div>
          </>
        )}
      </main>
    </>
  );
}
