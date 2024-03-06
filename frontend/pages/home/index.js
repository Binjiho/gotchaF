import NavBottom from "@/components/layout/NavBottom";
import LogoIcon from "@/public/icons/logos/black_logo.svg";
import MainHeader from "@/components/layout/MainHeader";
import { useDispatch } from "react-redux";
import { getCookie, setCookie } from "@/helper/cookies";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { sendGet } from "@/helper/api";
import { setUser } from "@/actions/userActions";

export default function Index() {
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
    });
  }, []);

  const getUserInfo = token => {
    sendGet(`/api/auth/user`, { token: token }, res => {
      dispatch(setUser(res.data.result));
      setCookie("user", JSON.stringify(res.data.result), 7);
    });
  };

  return (
    <>
      <MainHeader>
        <a type={"left"}>
          <LogoIcon width={42}></LogoIcon>
        </a>
      </MainHeader>
      <main></main>
      <NavBottom></NavBottom>
    </>
  );
}
