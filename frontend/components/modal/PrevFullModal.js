import { Modal } from "react-bootstrap";
import styles from "@/styles/component/layout/prevHeader.module.scss";
import PrevIcon from "@/public/icons/system/arrow-left-line.svg";
import React from "react";

export default function PrevFullModal({ children, show, setShow }) {
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props.type === type);
  };

  return (
    <Modal show={show} fullscreen animation={false}>
      <header className={styles.header}>
        <button className={styles.prevBtn} onClick={() => setShow(false)}>
          <PrevIcon />
        </button>
        <div className={styles.middle}>{renderChildrenByType("middle")}</div>
        <div className={styles.right}>{renderChildrenByType("right")}</div>
      </header>
      <div>{renderChildrenByType("content")}</div>
    </Modal>
  );
}
