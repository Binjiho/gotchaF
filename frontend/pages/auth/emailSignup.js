import PrevHeader from "@/components/layout/PrevHeader";
import styles from "@/styles/page/auth.module.scss";
import { Form, Button } from "react-bootstrap";
import HideValueInput from "@/components/form/HideValueInput";
import { useEffect, useState } from "react";
import AgreeTerms from "@/components/form/AgreeTerms";
import { sendAnonymousPost, sendGet } from "@/helper/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState({});
  const [valid, setValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (email.trim() !== "" && password.trim() !== "" && terms?.use && terms?.personal) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [email, password, terms]);

  const userSignup = () => {
    const data = {
      email: email,
      password: password,
      "name": "김유리",
      "position": "1",
      "sex": "2",
      "age": "2000",
      "social": null,
    };

    sendAnonymousPost("/api/auth/signup", data, res => {
      if (res.error) {
        toast(res.message);
      } else {
        router.back();
        toast("계정이 생성되었습니다.");
      }
    });
  };

  return (
    <>
      <PrevHeader></PrevHeader>
      <main className={styles.login}>
        <h2 className={styles.login__title}>회원가입</h2>
        <Form>
          <div className={`mt-[40px] mb-[20px]`}>
            <Form.Label htmlFor="" className={`text-[14px] mb-[8px] required`}>
              아이디
            </Form.Label>
            <Form.Control
              type="text"
              className={`height-50`}
              placeholder={"이메일를 입력해주세요"}
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className={`mt-[20px] mb-[30px]`}>
            <Form.Label htmlFor="" className={`text-[14px] mb-[8px] required`}>
              비밀번호
            </Form.Label>
            <HideValueInput
              value={password}
              setValue={setPassword}
              placeholder={"영어,숫자,특수문자 포함 10자 이상"}></HideValueInput>
          </div>
          <AgreeTerms setValue={setTerms}></AgreeTerms>
        </Form>
        <div className={`bottom-fixed btns`}>
          <Button
            className={`w-full`}
            variant="black"
            size="50"
            disabled={!valid}
            onClick={userSignup}>
            다음
          </Button>
        </div>
      </main>
    </>
  );
}
