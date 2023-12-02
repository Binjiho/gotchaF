import { useEffect, useState } from "react";
import axios from "axios";
import { sendGet } from "@/helper/api";

export default function SignIn() {
  const getCityList = function () {
    sendGet("/api/teams/", null, res => {
      console.log(res);
    });
  };

  useEffect(() => {
    getCityList();
  }, []);

  return (
    <>
      <main className={`pb-[20px]`}>kk</main>
    </>
  );
}
