import { Button, ToggleButton } from "react-bootstrap";
import { useState } from "react";
import styles from "@/styles/page/auth.module.scss";
import SnsLoginBtn from "@/components/btn/SnsLoginBtn";

export default function SignIn() {
  const [toggleSnsJoin, setToggleSnsJoin] = useState(false);

  return (
    <main className={`pt-[10vh] min-h-[100vh] pb-10 inner`}>
      <div className={styles.logo}></div>
      <div className={`flex align-items-center flex-column w-full gap-[10px] mb-[10px]`}>
        <SnsLoginBtn type="kakao" href="/api/auth/redirect/kakao">카카오로 시작하기</SnsLoginBtn>
        {toggleSnsJoin && (
          <>
            <SnsLoginBtn type="naver" href="/api/auth/redirect/naver">네이버로 시작하기</SnsLoginBtn>
            <SnsLoginBtn type="facebook" href="/api/auth/redirect/facebook">facebook으로 시작하기</SnsLoginBtn>
            <SnsLoginBtn type="google" href="/api/auth/redirect/google">
              google로 시작하기
            </SnsLoginBtn>
            <SnsLoginBtn type="email" href={`/auth/emailSignin`}>
              이메일로 시작하기
            </SnsLoginBtn>
          </>
        )}
      </div>
      {!toggleSnsJoin && (
        <Button
          onClick={() => setToggleSnsJoin(true)}
          className={`w-full`}
          variant="black"
          size="50">
          다른 방법으로 시작하기
        </Button>
      )}
      <Button className={styles.forgetAccount} variant={"text"}>
        계정을 잊으셨나요?
      </Button>
    </main>
  );
}
