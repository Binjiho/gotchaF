import { getCookie } from "@/helper/cookies";
import axiosInstance, { addTokenToHeader } from "../utils/axiosInstance";
import { REQUEST_HEADER_CONTENTS_JSON } from "@/constants/httpRequest";

export const getAccessToken = async () => {
  return "ss";
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
      contentsType
    )
    .then(res => {
      if (res?.data.message === "Success") {
        if (typeof successFun === "function") {
          successFun(res.data);
        } else {
          console.log(res.data);
        }
      } else {
        if (typeof failureFun === "function") {
          failureFun(res);
        } else {
          console.log(res);
        }
      }
    })
    .catch(error => {
      console.error(error);
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
    .post(url, requestData, contentsType)
    .then(res => {
      if (res?.data.message === "Success") {
        if (typeof successFun === "function") {
          successFun(res.data);
        } else {
          console.log(res.data);
        }
      } else {
        if (typeof failureFun === "function") {
          failureFun(res);
        } else {
          console.log(res);
        }
      }
    })
    .catch(error => {
      console.error(error);
    });
};
