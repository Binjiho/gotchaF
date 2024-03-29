export const SEX_TYPE = {
  0: "남여혼성",
  1: "남성",
  2: "여성",
  ALL: 0,
  MAN: 1,
  WOMAN: 2,
};

export const TEAM_MEMBER_LEVEL = {
  "L": "리더",
  "M": "운영진",
  "C": "일반",
  "W": "가입대기",
  LEADER: "L",
  MANAGEMENT: "M",
  COMMON: "C",
  WAITING_JOIN: "W",
};

export const COMPETITION_TYPE = {
  ALL: 0,
  LEAGUE: 1,
  CUP: 2,
  0: "ALL",
  1: "LEAGUE",
  2: "CUP",
};

export const COMPETITION_SORTING = {
  ALL: 0,
  PRE: "pre",
  ING: "ing",
  END: "end",
};

export const COMPETITION_KIND = {
  SOCCER: 1,
  FUTSAL: 2,
  1: "축구",
  2: "풋살",
};

export const TEAM_POSITION = {
  0: "전체",
  1: "공격수",
  2: "중원",
  3: "수비수",
  4: "골키퍼",
  ALL: 0,
  ATTACK: 1,
  MIDFIELD: 2,
  DEFENCE: 3,
  GOALKEEPER: 4,
};

export const COMPETITION_STATE = {
  W: false,
  S: true,
};

export const CUP_STATE = {
  "S": "SUCCESS", //우승
  "L": "LOSE", //탈락
  "W": "WIN", //진출
  SUCCESS: "S",
  LOSE: "L",
  WIN: "W",
};
