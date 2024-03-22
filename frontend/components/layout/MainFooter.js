import LogoIcon from "@/public/icons/logos/black_logo.svg";
import React from "react";
import Link from "next/link";

export default function MainFooter() {
  return (
    <footer className={`bg-white py-[40px] px-[20px]`}>
      <div>
        <LogoIcon width={41}></LogoIcon>
      </div>
      <p className={`text-[18px] font-medium pt-[15px] pb-[30px]`}>gotcha@gmail.com</p>
      <ul className={`flex gap-[10px] text-[14px] font-bold text-gray10`}>
        <li>
          <Link href={"/"}>공지사항</Link>
        </li>
        <li>
          <Link href={"/"}>FAQ</Link>
        </li>
        <li>
          <Link href={"/"}>1:1문의</Link>
        </li>
        <br />
        <li>
          <Link href={"/"}>회사소개</Link>
        </li>
        <li>
          <Link href={"/"}>이용약관</Link>
        </li>
        <li>
          <Link href={"/"}>개인정보취급방침</Link>
        </li>
      </ul>
      <ul className={`text-gray7 text-[12px] flex flex-column py-[10px]`}>
        <li>사업자 등록번호 : </li>
        <li>통신판매업신고번호 : </li>
        <li>개인정보관리책임자 : </li>
        <li>서울특별시 주소주소주소주소주소주소</li>
      </ul>
      <p className={`text-gray9 text-[12px]`}>
        Copyright © 영어회사명 Co. All rights reserved.
      </p>
    </footer>
  );
}
