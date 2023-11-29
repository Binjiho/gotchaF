import PrevHeader from "@/components/layout/PrevHeader";
import styles from "@/styles/page/auth.module.scss";
import { Form, Button } from "react-bootstrap";

export default function EmailSignin() {
  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={styles.login}>
        <h2 className={styles.login__title}>이메일로 시작하기</h2>
        <Form className={`flex flex-wrap gap-[12px] mt-[40px]`}>
          <Form.Control
            type="text"
            className={`height-50`}
            placeholder={`아이디를 입력해주세요`}
          />
          <Form.Control
            type="password"
            className={`height-50`}
            placeholder={`비밀번호를 입력해주세요`}
          />
          <Button className={`w-full`} variant="black" size="50">
            로그인
          </Button>
        </Form>
        <div className={`flex justify-end mt-[16px] gap-[8px] align-items-center`}>
          <Button variant="text" className={`text-[14px] text-gray7`}>
            아이디 찾기
          </Button>
          <span className={`gap-line`}></span>
          <Button variant="text" className={`text-[14px] text-gray7`}>
            비밀번호 찾기
          </Button>
        </div>
        <div className={`bottom-fixed btns text-center`}>
          <p className={`text-gray7 text-[14px] mb-[7px]`}>계정이 없으신가요?</p>
          <Button variant="text" className={`font-bold text-[16px] text-gray10`}>
            이메일로 회원가입
          </Button>
        </div>
      </main>
    </>
  );
}
