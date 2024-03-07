import PrevHeader from "@/components/layout/PrevHeader";
import EditItem from "@/components/team/EditItem";
import EditLabel from "@/components/team/EditLabel";
import { useRouter } from "next/router";
import { useModal } from "@/context/ModalContext";
import { sendPost } from "@/helper/api";
import { toast } from "react-toastify";

export default function Setting() {
  const router = useRouter();
  const teamId = router.query.id;
  const { openModal } = useModal();

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

  const deleteTeam = () => {
    sendPost(
      `/api/teams/delete-team/${teamId}`,
      null,
      res => {
        toast("팀이 삭제되었습니다");
        router.back();
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
          <EditItem
            title={`리더 양도`}
            style={`border-none`}
            onButtonClick={() => router.push(`/team/${teamId}/edit/leader`)}></EditItem>
        </div>
        <hr className={`hr-line`} />
        <div className={`inner`}>
          <EditItem
            title={`팀 삭제하기`}
            style={`text-red_primary`}
            onButtonClick={transConfirm}></EditItem>
        </div>
      </main>
    </>
  );
}
