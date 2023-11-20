import styles from "@/styles/component/layout/common.module.scss";

export default function Layout({ children }) {
  return (
    <>
      <div className={styles.main}>
        <div>{children}</div>
      </div>
    </>
  );
}
