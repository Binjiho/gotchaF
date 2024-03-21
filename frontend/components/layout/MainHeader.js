import styles from "@/styles/component/layout/mainHeader.module.scss";
import React from "react";
import LogoIcon from "@/public/icons/logos/black_logo.svg";
import Link from "next/link";
import Image from "next/image";
import RightIcon from "@/public/icons/system/arrow-right-line.svg";

export default function MainHeader({ children, onSearch }) {
  return (
    <header className={`${styles.header}`}>
      <div className={`left`}>
        <Link href={"/"}>
          <Image
            src={"/images/logo_simbol.png"}
            width={43}
            height={33}
            alt="gotcha logo simbol"></Image>
          <LogoIcon width={42}></LogoIcon>
        </Link>
      </div>
      <Link href="/auth/signin" className={`text-[15px] text-gray10 flex`}>
        로그인/회원가입
        <RightIcon></RightIcon>
      </Link>
    </header>
  );
}
