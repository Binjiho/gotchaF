import { COMPETITION_KIND, SEX_TYPE } from "@/constants/serviceConstants";

export const competitionKindList = [
  {
    value: COMPETITION_KIND.SOCCER,
    name: COMPETITION_KIND[1],
  },
  {
    value: COMPETITION_KIND.FUTSAL,
    name: COMPETITION_KIND[2],
  },
];

export const teamLengthList = () => {
  const numberList = [];
  for (let i = 4; i <= 20; i++) {
    numberList.push({
      value: i,
      name: i,
    });
  }
  return numberList;
};

export const genderTypeList = [
  {
    value: SEX_TYPE.ALL,
    name: SEX_TYPE[0],
  },
  {
    value: SEX_TYPE.MAN,
    name: SEX_TYPE[1],
  },
  {
    value: SEX_TYPE.WOMAN,
    name: SEX_TYPE[2],
  },
];

export const yearList = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 35; // 35년 전 연도 계산
  const endYear = currentYear - 20;

  const yearList = [];
  for (let year = endYear; year >= startYear; year--) {
    yearList.push({
      value: year,
      name: year + "년도",
    });
  }

  return yearList;
};

export const personnelList = () => {
  const numberList = [];
  for (let i = 5; i <= 100; i++) {
    numberList.push({
      value: i,
      name: i + "명",
    });
  }
  return numberList;
};
