import React from "react";
import ReactDOM from "react-dom";
import { BsArrowUp } from "react-icons/bs";
import styles from "./FixedButtons.module.scss";

const FixedButtons = ({ onScrollTop, onWrite, showScrollTop }) => {
  return ReactDOM.createPortal(
    <div className={styles.fixedButtonsContainer}>
      {showScrollTop && (
        <button className={styles.scrollTopButton} onClick={onScrollTop}>
          <BsArrowUp />
        </button>
      )}
      <button className={styles.writeButton} onClick={onWrite}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
        </svg>
        <span>글쓰기</span>
      </button>
    </div>,
    document.body
  );
};

export default FixedButtons;
