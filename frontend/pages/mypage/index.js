import { Button } from "react-bootstrap";
import NavBottom from "@/components/layout/NavBottom";
import SearchHeader from "@/components/layout/SearchHeader";
import { sendGet } from "@/helper/api";
import { getCookie, removeCookie, setCookie } from "@/helper/cookies";
import { useRouter } from "next/router";
import { logoutUser } from "@/actions/userActions";
import { useDispatch } from "react-redux";
import UserIcon from "@/public/icons/social/user_line.svg";
import { useSelector } from "react-redux";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

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
        {!user?.sid ? (
          <>
            <div className={`flex align-items-center my-[30px]`}>
              <div
                className={`bg-gray3 text-gray6 flex align-items-center justify-center w-[62px] h-[62px] rounded-[3px]`}>
                <UserIcon width={24}></UserIcon>
              </div>
              <p className={`text-[18px] font-bold ml-[16px]`}>로그인이 필요합니다</p>
            </div>
            <div className={`grid grid-cols-2 gap-[7px]`}>
              <Button
                variant="green-primary-line"
                size={50}
                onClick={() => router.push("/auth/signin")}>
                로그인
              </Button>
              <Button
                variant="green-primary"
                size={50}
                onClick={() => router.push("/auth/signin")}>
                회원가입
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button variant={`text`} onClick={logout}>
              로그아웃
            </Button>
          </>
        )}
      </main>
      <NavBottom></NavBottom>
    </>
  );
}
