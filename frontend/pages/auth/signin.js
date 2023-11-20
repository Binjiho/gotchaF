import { Button, ToggleButton } from "react-bootstrap";
import { useState } from "react";
import styles from "@/styles/page/auth.module.scss";
import SnsLoginBtn from "@/components/btn/SnsLoginBtn";

export default function SignIn() {
  const [toggleSnsJoin, setToggleSnsJoin] = useState(false);

  return (
    <main className={styles.join}>
      <div className={styles.logo}></div>
      <div className={styles.btns}>
        <SnsLoginBtn type="kakao">카카오로 시작하기</SnsLoginBtn>
        {toggleSnsJoin && (
          <>
            <SnsLoginBtn type="naver">네이버로 시작하기</SnsLoginBtn>
            <SnsLoginBtn type="facebook">facebook으로 시작하기</SnsLoginBtn>
            <SnsLoginBtn type="google" href="/api/auth/redirect/google">
              google로 시작하기
            </SnsLoginBtn>
            <SnsLoginBtn type="email" href="/api/auth/redirect/google">
              이메일로 시작하기
            </SnsLoginBtn>
          </>
        )}
      </div>
      {!toggleSnsJoin && (
        <Button onClick={() => setToggleSnsJoin(true)} className={styles.otherBtn}>
          다른 방법으로 시작하기
        </Button>
      )}
      <Button className={styles.forgetAccount}>계정을 잊으셨나요?</Button>
    </main>
  );
}
