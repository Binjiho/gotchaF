import NavBottom from "@/components/layout/NavBottom";
import MainHeader from "@/components/layout/MainHeader";
import { useDispatch } from "react-redux";
import { getCookie, removeCookie, setCookie } from "@/helper/cookies";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { sendGet } from "@/helper/api";
import { setUser } from "@/actions/userActions";
import Image from "next/image";
import { Button } from "react-bootstrap";
import MainFooter from "@/components/layout/MainFooter";

export default function Index() {
  const dispatch = useDispatch();

  const getToken = async () => {
    return await getCookie("token");
  };

  useEffect(() => {
    getToken().then(res => {
      if (res) {
        removeCookie("token");
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
      <MainHeader></MainHeader>
      <main>
        <div>
          <Image
            src={"/images/main_banner.png"}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt="main banner"></Image>
        </div>
        <div
          className={`h-[368px] bg-[#f1f1f1] flex flex-column gap-[50px] text-center items-center justify-center`}>
          <p className={`text-[24px] font-bold`}>
            내가 여는
            <br />
            우리 동네 풋살 대회
            <br />
            우리 같이 차자!
          </p>
          <Button variant="green-primary" className={`w-[250px] font-bold`} size={60}>
            같차 둘러보기
          </Button>
        </div>
      </main>
      <MainFooter></MainFooter>
      <NavBottom></NavBottom>
    </>
  );
}
