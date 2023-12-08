import styles from "@/styles/component/layout/prevHeader.module.scss";
import PrevIcon from "@/public/icons/system/arrow-left-line.svg";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function PrevHeader({ children, transparent = false }) {
  const [isScroll, setIsScroll] = useState(false);

  const router = useRouter();
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props.type === type);
  };

  useEffect(() => {
    setHeaderColor();
  });

  const setHeaderColor = () => {
    const scrollTrigger = 60;

    if (!transparent) return;

    window.onscroll = function () {
      if (window.scrollY >= scrollTrigger || window.pageYOffset >= scrollTrigger) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
  };

  return (
    <header
      className={`${styles.header} ${styles.fixed} ${transparent && styles.transparent} ${
        isScroll && styles.scroll
      }`}
      id={`prevHeader`}>
      <button className={styles.prevBtn} onClick={router.back}>
        <PrevIcon />
      </button>
      <div className={styles.middle}>{renderChildrenByType("middle")}</div>
      <div className={styles.right}>{renderChildrenByType("right")}</div>
    </header>
  );
}
