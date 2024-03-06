import PrevHeader from "@/components/layout/PrevHeader";
import EditItem from "@/components/team/EditItem";
import EditLabel from "@/components/team/EditLabel";
import { useRouter } from "next/router";
import { useModal } from "@/context/ModalContext";
import { sendPatch } from "@/helper/api";
import { toast } from "react-toastify";

export default function Setting() {
  const router = useRouter();
  const competitionId = router.query.id;
  const { openModal } = useModal();

  const transCompetition = item => {
    const modalContent = (
      <div className={`text-center`}>
        <strong className={`text-[18px]`}>대회를 삭제하시겠습니까?</strong>
        <p className={`text-[14px] mt-[10px]`}>삭제 후에는 복구가 불가능합니다.</p>
      </div>
    );

    openModal(
      modalContent,
      async () => {
        await deleteCompetition(item);
      },
      () => {
        return;
      }
    );
  };

  const deleteCompetition = () => {
    sendPatch(
      `/api/competitions/${competitionId}`,
      null,
      res => {
        toast("대회가 삭제되었습니다");
        router.back();
      },
      () => {}
    );
  };

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          대회 설정
        </h2>
      </PrevHeader>
      <main>
        <EditLabel title={"대회 기본 정보 관리"}></EditLabel>
        <div className={`inner`}>
          <EditItem
            title={`대회 설정`}
            style={`border-none`}
            onButtonClick={() =>
              router.push(`/competition/${competitionId}/edit`)
            }></EditItem>
        </div>
        <hr className={`hr-line`} />
        <div className={`inner`}>
          <EditItem
            title={`대회 삭제하기`}
            style={`text-red_primary`}
            onButtonClick={transCompetition}></EditItem>
        </div>
      </main>
    </>
  );
}
