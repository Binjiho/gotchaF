import PrevHeader from "@/components/layout/PrevHeader";
import styles from "@/styles/page/auth.module.scss";
import { Form, Button } from "react-bootstrap";
import PlusIcon from "@/public/icons/system/add-line.svg";

export default function snsSignup() {
  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={styles.login}>
        <h2 className={styles.login__title}>회원가입</h2>
        <Form>
          <div className={`mt-[40px] mb-[20px]`}>
            <Form.Label htmlFor="" className={`text-[14px] mb-[8px]`}>
              카카오로 연결됨*
            </Form.Label>
            <Form.Control
              type="text"
              disabled
              value={`gotcha@gmail.com`}
              className={`height-50`}
            />
          </div>
        </Form>
        <div className={`bottom-fixed btns`}>
          <Button className={`w-full`} variant="black" size="50" disabled>
            다음
          </Button>
        </div>
      </main>
    </>
  );
}
