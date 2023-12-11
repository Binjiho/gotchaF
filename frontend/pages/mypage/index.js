import { Button } from "react-bootstrap";
import NavBottom from "@/components/layout/NavBottom";
import SearchHeader from "@/components/layout/SearchHeader";
import { sendGet } from "@/helper/api";
import { getCookie, removeCookie, setCookie } from "@/helper/cookies";
import { useRouter } from "next/router";
import { logoutUser } from "@/actions/userActions";
import { useDispatch } from "react-redux";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = async () => {
    const token = await getCookie("accessToken");

    sendGet(
      `/api/auth/logout`,
      {
        token: token,
      },
      res => {
        dispatch(logoutUser());
        localStorage.removeItem("persist:user");
        removeCookie("user");
        removeCookie("accessToken");
        router.push("/");
      }
    );
  };

  return (
    <>
      <SearchHeader>
        <p type={"left"}>마이페이지</p>
      </SearchHeader>
      <main>
        <Button variant={`text`} onClick={logout}>
          로그아웃
        </Button>
      </main>
      <NavBottom></NavBottom>
    </>
  );
}
