import styles from "@/styles/component/layout/prevHeader.module.scss";
import SearchIcon from "@/public/icons/tool/search.svg";
import React from "react";

export default function SearchHeader({ children, onSearch }) {
  const renderChildrenByType = type => {
    return React.Children.toArray(children).filter(child => child.props.type === type);
  };

  return (
    <header className={`${styles.header} ${styles.fixed}`}>
      <div className={styles.title}>{renderChildrenByType("left")}</div>
      {onSearch && (
        <button className={`${styles.searchBtn} ${styles.right}`} onClick={onSearch}>
          <SearchIcon></SearchIcon>
        </button>
      )}
    </header>
  );
}
