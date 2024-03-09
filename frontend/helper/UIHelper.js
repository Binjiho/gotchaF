import { toast } from "react-toastify";
import { weekList } from "@/constants/UiConstants";

export const replaceSpacesWithDot = inputString => {
  // 정규식을 사용하여 문자열에서 중간 공백을 '·'로 바꿉니다.
  let replacedString = inputString.replace(/\s/g, "·");
  return replacedString;
};

export const replaceQueryPage = (obj = {}, router) => {
  const query = removeEmptyObject({ ...obj });

  let location = {
    query: query,
  };

  router.replace(location, undefined, { shallow: true });
};

export const removeEmptyObject = obj => {
  const res = { ...obj };

  if (obj && Object.keys(obj).length !== 0) {
    Object.keys(res).forEach(key => {
      if (!res[key] && res[key] !== 0) {
        delete res[key];
      }
    });
  }
  return res;
};

export const getParameter = key => {
  return "";
  // return new URLSearchParams(location.search).get(key);
};

export const convertIntObj = obj => {
  const res = {};
  for (const key in obj) {
    res[key] = {};
    if (/[,a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/.test(obj[key])) {
      res[key] = obj[key];
    } else {
      const parsed = parseInt(obj[key], 10);
      res[key] = isNaN(parsed) ? obj[key] : parsed;
    }
  }
  return res;
};

export const shareNowUrl = () => {
  const shareObject = {
    title: `같차`,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator
      .share(shareObject)
      .then(() => {})
      .catch(err => {
        console.log(err);
      });
  } else {
    toast("페이지 공유를 지원하지 않습니다.");
  }
};

export const convertWeek = yoil => {
  const weekObject = weekList.reduce((acc, curr) => {
    acc[curr.value] = curr.name;
    return acc;
  }, {});

  let week = "";

  yoil.split(",").map(item => {
    week = week + `${week !== "" ? "," : ""}${weekObject[item]}`;
  });

  return week;
};

export const calculateDday = targetDate => {
  const currentDate = new Date();
  const dDay = new Date(targetDate);
  const timeDiff = dDay.getTime() - currentDate.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return dayDiff;
};

export const printDday = targetDate => {
  const day = calculateDday(targetDate);

  return day < 0 ? `D+${Math.abs(day)}` : day === 0 ? "D-Day" : `D-${day}`;
};
