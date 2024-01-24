import styles from "@/styles/component/layout/mainHeader.module.scss";
import React from "react";
import LogoIcon from "@/public/icons/logos/black_logo.svg";
import Link from "next/link";

export default function MainHeader({ children, onSearch }) {
  return (
    <header className={`${styles.header}`}>
      <div>
        <LogoIcon width={42}></LogoIcon>
      </div>
      <Link href="/auth/signin" className={`text-[15px] text-gray10`}>
        로그인
      </Link>
    </header>
  );
}
