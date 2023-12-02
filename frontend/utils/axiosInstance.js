import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const axiosInstance = axios.create({
  baseURL: `${publicRuntimeConfig.backendUrl}/`,
  // timeout: 5000,
});

// 토큰을 추가하는 함수
export const addTokenToHeader = token => {
  if (token) {
    const tokenWithoutQuotes = token.replace(/"/g, "");

    // Axios 인스턴스의 기본 헤더에 토큰 추가
    axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer ${tokenWithoutQuotes}`;
  } else {
    // 토큰이 없는 경우 기본 헤더에서 제거
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export default axiosInstance;
