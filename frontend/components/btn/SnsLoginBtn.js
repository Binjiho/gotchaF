import { Button } from "react-bootstrap";
import styles from "@/styles/component/btn/snsLoginBtn.module.scss";

export default function SnsLoginBtn({ children, type, click }) {
  return (
    <Button onClick={click} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </Button>
  );
}
