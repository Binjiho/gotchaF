import PrevHeader from "@/components/layout/PrevHeader";
import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import UploadImage from "@/components/image/UploadImage";
import { genderTypeList, teamPositionList, yearList } from "@/constants/UiConstants";
import CommonSelect from "@/components/form/CommonSelect";
import { useDispatch, useSelector } from "react-redux";
import { getCookie, removeCookie, setCookie } from "@/helper/cookies";
import { sendGet, sendPost } from "@/helper/api";
import { logoutUser, setUser } from "@/actions/userActions";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { REQUEST_HEADER_CONTENTS_FORM } from "@/constants/httpRequest";

export default function Edit() {
  const [formClear, setFormClear] = useState(false);
  const [file, setFile] = useState(null);
  const [nickName, setNickName] = useState("");
  const [position, setPosition] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [htel, setHtel] = useState("");
  const userInfo = useSelector(state => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      setFile(userInfo.file_path);
      setNickName(userInfo.name);
      setPosition(Number(userInfo.position));
      setGender(Number(userInfo.sex));
      setAge(userInfo.age);
      setEmail(userInfo.email);
      setHtel(userInfo.htel);
    }
  }, [userInfo]);

  useEffect(() => {
    if (nickName.trim() === "" || !position) {
      setFormClear(false);
      return;
    }

    setFormClear(true);
  }, [nickName, position]);

  const editMyInfo = () => {
    const data = {
      name: nickName,
      position: position,
      sex: gender,
      age: age,
      htel: htel,
    };

    sendPost(
      `/api/mypage`,
      data,
      res => {
        editProfile();
      },
      () => {}
    );
  };

  const editProfile = () => {
    const formData = new FormData();
    formData.append("files[]", file);

    sendPost(
      `/api/mypage/thum`,
      formData,
      res => {
        toast("내 정보가 수정되었습니다");
        getMyInfo();
        router.back();
      },
      () => {},
      REQUEST_HEADER_CONTENTS_FORM
    );
  };

  const getMyInfo = () => {
    sendGet(
      `/api/auth/user`,
      {
        token: userInfo.accessToken,
      },
      res => {
        dispatch(setUser(res.data.result));
        setCookie("user", JSON.stringify(res.data.result), 7);
      }
    );
  };

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
      <PrevHeader>
        <h2 type={"middle"} className={`text-[15px]`}>
          내 정보 수정
        </h2>
        <div type={"right"}>
          <Button
            variant={"text"}
            className={`text-[15px] text-green_primary bg-white [&:disabled]:!text-gray7`}
            disabled={!formClear}
            onClick={editMyInfo}>
            저장
          </Button>
        </div>
      </PrevHeader>
      <main className={`pb-[50px]`}>
        <Form className={`inner`}>
          <div className={`mx-auto w-fit mt-[30px] mb-[40px]`}>
            <UploadImage file={file} setFile={setFile}></UploadImage>
          </div>
          <div className={`flex flex-column gap-[20px]`}>
            <div>
              <Form.Label htmlFor="" className={`text-[14px] mb-[8px] required`}>
                닉네임
              </Form.Label>
              <Form.Control
                type="text"
                className={`height-50`}
                placeholder={"닉네임을 입력해주세요"}
                value={nickName}
                onChange={e => setNickName(e.target.value)}
              />
            </div>
            <div>
              <Form.Label htmlFor="" className={`text-[14px] mb-[8px] required`}>
                희망 포지션
              </Form.Label>
              <CommonSelect
                value={position}
                setValue={setPosition}
                list={teamPositionList}
                size={50}></CommonSelect>
            </div>
            <div>
              <Form.Label htmlFor="" className={`text-[14px] mb-[8px]`}>
                성별
              </Form.Label>
              <CommonSelect
                value={gender}
                setValue={setGender}
                list={genderTypeList}
                size={50}></CommonSelect>
            </div>
            <div>
              <Form.Label htmlFor="" className={`text-[14px] mb-[8px]`}>
                나이
              </Form.Label>
              <CommonSelect
                value={age}
                setValue={setAge}
                list={yearList()}
                size={50}></CommonSelect>
            </div>
          </div>
        </Form>
        <hr className={`hr-line my-[25px]`} />
        <div className={`flex flex-column gap-[20px] inner`}>
          <div>
            <Form.Label htmlFor="" className={`text-[14px] mb-[8px] required`}>
              이메일(최초가입)
            </Form.Label>
            <Form.Control
              type="text"
              className={`height-50`}
              defaultValue={email}
              disabled={true}
            />
          </div>
          <div>
            <Form.Label htmlFor="" className={`text-[14px] mb-[8px] required`}>
              휴대폰번호
            </Form.Label>
            <Form.Control
              type="text"
              className={`height-50`}
              defaultValue={htel}
              disabled={true}
            />
          </div>
        </div>
        <hr className={`hr-line my-[25px]`} />
        <div className={`inner`}>
          <Button variant="gray2 w-full" size={40} onClick={logout}>
            로그아웃
          </Button>
        </div>
      </main>
    </>
  );
}
