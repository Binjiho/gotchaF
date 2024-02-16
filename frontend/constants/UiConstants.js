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

export const frequencyGameList = () => {
  const list = [
    "주1회",
    "주2회",
    "주3회",
    "주4회",
    "주5회",
    "주6회",
    "주7회",
    "월1회",
    "월2회",
    "월3회",
  ];

  const frequencyList = [];
  for (let i = 0; i <= list.length; i++) {
    frequencyList.push({
      value: list[i],
      name: list[i],
    });
  }
  return frequencyList;
};

export const numberPlayersList = () => {
  const numberList = [];
  for (let i = 4; i <= 12; i++) {
    numberList.push({
      value: `${i}:${i}`,
      name: `${i}:${i}`,
    });
  }
  return numberList;
};

export const weekList = [
  {
    value: 1,
    name: "월",
  },
  {
    value: 2,
    name: "화",
  },
  {
    value: 3,
    name: "수",
  },
  {
    value: 4,
    name: "목",
  },
  {
    value: 5,
    name: "금",
  },
  {
    value: 6,
    name: "토",
  },
  {
    value: 0,
    name: "일",
  },
];
