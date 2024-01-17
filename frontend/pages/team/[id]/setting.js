import PrevHeader from "@/components/layout/PrevHeader";
import EditItem from "@/components/team/EditItem";
import EditLabel from "@/components/team/EditLabel";
import { useRouter } from "next/router";

export default function Setting() {
  const router = useRouter();
  const teamId = router.query.id;

  return (
    <>
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          팀 설정
        </h2>
      </PrevHeader>
      <main>
        <EditLabel title={"팀 기본 정보 관리"}></EditLabel>
        <EditItem title={`팀 프로필 설정`} style={`border-none`}></EditItem>

        <EditLabel title={"멤버 가입 관리"}></EditLabel>
        <EditItem title={`가입 조건 설정`}></EditItem>
        <EditItem
          title={`가입대기리스트`}
          onButtonClick={() => router.push(`/team/${teamId}/edit/join`)}></EditItem>

        <EditLabel title={"멤버 활동 관리"}></EditLabel>
        <EditItem title={`멤버 탈퇴`}></EditItem>
        <EditItem title={`운영진 관리`}></EditItem>
        <EditItem title={`리더 양도`} style={`border-none`}></EditItem>

        <hr className={`hr-line`} />
        <EditItem title={`팀 삭제하기`} style={`text-red_primary`}></EditItem>
      </main>
    </>
  );
}
