import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCookie, setCookie } from "@/helper/cookies";
import { sendGet } from "@/helper/api";
import { setUser } from "@/actions/userActions";
import { toast } from "react-toastify";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  const getToken = async () => {
    return await getCookie("token");
  };

  useEffect(() => {
    getToken().then(res => {
      if (res) {
        setCookie("accessToken", res);
        getUserInfo(res);
        toast("로그인 되었습니다.");
      }
      router.replace("/home");
    });

    router.replace("/home");
  }, []);

  const getUserInfo = token => {
    sendGet(`/api/auth/user`, { token: token }, res => {
      dispatch(setUser(res.data.result));
      setCookie("user", JSON.stringify(res.data.result), 7);
    });
  };

  return <div></div>;
}
