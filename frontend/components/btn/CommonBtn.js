import { Button } from "react-bootstrap";
import styles from "@/styles/component/btn/commonBtn.module.scss";

export default function SnsLoginBtn({ children, disabled }) {
  return (
    <Button className={`${styles.btn}`} disabled={disabled}>
      {children}
    </Button>
  );
}
