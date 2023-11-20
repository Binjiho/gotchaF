import styles from "@/styles/component/layout/prevHeader.module.scss";
import PrevIcon from "@/public/icons/system/arrow-left-line.svg";

export default function PrevHeader() {
  return (
    <header className={styles.header}>
      <button className={styles.prevBtn}>
        <PrevIcon />
      </button>
    </header>
  );
}
