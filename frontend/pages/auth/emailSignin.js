import PrevHeader from "@/components/layout/PrevHeader";
import styles from "@/styles/page/auth.module.scss";
import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { sendAnonymousPost, sendGet } from "@/helper/api";
import { setCookie } from "@/helper/cookies";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/actions/userActions";
import { toast } from "react-toastify";

export default function EmailSignin() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [userToken, setUserToken] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const login = () => {
    const data = {
      email: userId,
      password: userPw,
    };

    sendAnonymousPost("/api/auth/signin", data, res => {
      if (!res?.data?.token) {
        toast("잘못된 아이디이거나 비밀번호 입니다.");
        return;
      }

      setCookie("accessToken", res.data.token);
      setUserToken(res.data.token);
    });
  };

  useEffect(() => {
    if (!userToken) return;
    getUserInfo(userToken);
  }, [userToken]);

  const getUserInfo = token => {
    sendGet(`/api/auth/user`, { token: token }, res => {
      dispatch(setUser(res));
      setCookie("user", JSON.stringify(res), 7);
      router.push("/team");
    });
  };

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
            required
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
          <Form.Control
            type="password"
            className={`height-50`}
            placeholder={`비밀번호를 입력해주세요`}
            required
            value={userPw}
            onChange={e => setUserPw(e.target.value)}
            autoComplete={"on"}
          />
          <Button
            className={`w-full`}
            variant="black"
            size="50"
            onClick={login}
            disabled={!userId || !userPw}>
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
