import styles from "@/styles/component/layout/prevHeader.module.scss";
import PrevIcon from "@/public/icons/system/arrow-left-line.svg";
import { useRouter } from "next/router";
import React from "react";

export default function PrevHeader({ children }) {
  const router = useRouter();
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props.type === type);
  };

  return (
    <header className={`${styles.header} ${styles.fixed}`}>
      <button className={styles.prevBtn} onClick={router.back}>
        <PrevIcon />
      </button>
      <div className={styles.middle}>{renderChildrenByType("middle")}</div>
      <div className={styles.right}>{renderChildrenByType("right")}</div>
    </header>
  );
}
