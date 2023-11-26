import styles from "@/styles/component/layout/prevHeader.module.scss";
import PrevIcon from "@/public/icons/system/arrow-left-line.svg";
import { useRouter } from "next/router";

export default function PrevHeader() {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <button className={styles.prevBtn} onClick={router.back}>
        <PrevIcon />
      </button>
    </header>
  );
}
