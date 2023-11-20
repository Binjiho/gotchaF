import PrevHeader from "@/components/layout/PrevHeader";
import styles from "@/styles/page/auth.module.scss";
import CommonBtn from "@/components/btn/CommonBtn";
import { Form } from "react-bootstrap";
import PlusIcon from "@/public/icons/system/add-line.svg";

export default function SnsSignup() {
  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={styles.snsSignup}>
        <h2 className={styles.snsSignup__title}>회원가입</h2>
        <Form>
          <div className={styles.snsSignup__connect}>
            <Form.Label htmlFor="">카카오로 연결됨*</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={`gotcha@gmail.com`}
              className={`height-50`}
            />
          </div>
          <div className={styles.agree_item}>
            <Form.Check
              inline
              label="[필수] 만 14세 이상이며 모두 동의합니다."
              name="group1"
              type={`checkbox`}
              id={`inline-checkbox-1`}
            />
            <button className={styles.plusBtn}>
              <PlusIcon />
            </button>
          </div>
          <div className={styles.agree_item}>
            <Form.Check
              inline
              label="[선택] 광고성 정보 수신에 모두 동의합니다."
              name="group1"
              type={`checkbox`}
              id={`inline-checkbox-2`}
            />
            <button className={styles.plusBtn}>
              <PlusIcon />
            </button>
          </div>
        </Form>
        <div className={`bottom-fixed btns`}>
          <CommonBtn disabled>다음</CommonBtn>
        </div>
      </main>
    </>
  );
}
