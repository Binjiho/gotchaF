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

    const signup = () => {
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
            dispatch(setUser(res.data.result));
            setCookie("user", JSON.stringify(res.data.result), 7);
            router.push("/");
        });
    };

    return (
        <>
            <PrevHeader></PrevHeader>
            <main className={styles.login}>
                <h2 className={styles.login__title}>sns계정으로 시작하기</h2>
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
                        onClick={signup}
                        disabled={!userId || !userPw}>
                        회원가입
                    </Button>
                </Form>
            </main>
        </>
    );
}
