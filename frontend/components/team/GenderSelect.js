import { useState, useEffect } from "react";
import { SEX_TYPE } from "@/constants/serviceConstants";
import EditItemSelect from "@/components/team/EditItemSelect";

export default function GenderSelect({ genderType, setGenderType }) {
  const list = [
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

  return (
    <>
      <EditItemSelect
        placeholder={`성별 선택`}
        title={`성별`}
        value={genderType}
        setValue={setGenderType}
        list={list}></EditItemSelect>
    </>
  );
}
