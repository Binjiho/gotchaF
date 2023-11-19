import styles from "@/styles/layout/common.module.scss";

export default function Layout({ children }) {
  return (
    <>
      <main className={styles.main}>
        <div>{children}</div>
      </main>
    </>
  );
}
