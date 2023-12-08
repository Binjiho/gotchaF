export const replaceSpacesWithDot = inputString => {
  // 정규식을 사용하여 문자열에서 중간 공백을 '·'로 바꿉니다.
  let replacedString = inputString.replace(/\s/g, "·");
  return replacedString;
};
