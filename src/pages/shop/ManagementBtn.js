
import React from "react";
import styles from "./ManagementTreats.module.scss"; // CSS 모듈 불러오기

const ManagementBtn = ({ onEdit, onDelete }) => {
  return (
    <>
      <button className={styles.editButton} onClick={onEdit}>
        수정
      </button>
      <button className={styles.deleteButton} onClick={onDelete}>
        삭제
      </button>
    </>
  );
};

export default ManagementBtn;
