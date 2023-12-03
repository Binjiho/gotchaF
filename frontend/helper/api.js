import { getCookie } from "@/helper/cookies";
import axiosInstance, { addTokenToHeader } from "../utils/axiosInstance";
import { REQUEST_HEADER_CONTENTS_JSON } from "@/constants/httpRequest";

export const getAccessToken = async () => {
  return await getCookie("accessToken");
};

export const sendGet = async (
  url,
  requestData,
  successFun = null,
  failureFun = null,
  contentsType = REQUEST_HEADER_CONTENTS_JSON
) => {
  const accessToken = await getAccessToken();
  addTokenToHeader(accessToken);

  if (accessToken !== null) {
    requestGet(url, requestData, successFun, failureFun, contentsType);
  }
};

export const sendPost = async (
  url,
  requestData,
  successFun = null,
  failureFun = null,
  contentsType = REQUEST_HEADER_CONTENTS_JSON
) => {
  const accessToken = await getAccessToken();
  addTokenToHeader(accessToken);

  if (accessToken !== null) {
    requestPost(url, requestData, successFun, failureFun, contentsType);
  }
};

export const sendAnonymousPost = async (
  url,
  requestData,
  successFun = null,
  failureFun = null,
  contentsType = REQUEST_HEADER_CONTENTS_JSON
) => {
  addTokenToHeader(null);

  requestPost(url, requestData, successFun, failureFun, contentsType);
};

export const requestGet = async (
  url,
  requestData,
  successFun = null,
  failureFun = null,
  contentsType = REQUEST_HEADER_CONTENTS_JSON
) => {
  axiosInstance
    .get(
      url,
      {
        params: requestData,
      },
      {
        headers: {
          "Content-Type": contentsType,
        },
      }
    )
    .then(res => {
      if (typeof successFun === "function") {
        successFun(res.data);
      } else {
        console.log(res.data);
      }
    })
    .catch(error => {
      if (typeof failureFun === "function") {
        failureFun(error);
      } else {
        console.log(error);
      }
    });
};

export const requestPost = async (
  url,
  requestData,
  successFun = null,
  failureFun = null,
  contentsType = REQUEST_HEADER_CONTENTS_JSON
) => {
  axiosInstance
    .post(url, requestData, {
      headers: {
        "Content-Type": contentsType,
      },
    })
    .then(res => {
      if (typeof successFun === "function") {
        successFun(res.data);
      } else {
        console.log(res.data);
      }
    })
    .catch(error => {
      if (typeof failureFun === "function") {
        failureFun(error);
      } else {
        console.log(error);
      }
    });
};
