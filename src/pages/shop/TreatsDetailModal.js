import React from "react";
import styles from "./TreatsDetailModal.module.scss"; // 스타일 파일이 필요합니다.
import TreatDetail from "./TreatsDetail";
import ReviewPage from "./review/ReviewPage";

const Modal = ({ isOpen, onClose, treatsId }) => {
  if (!isOpen) return null;

  console.info("TreatsDetailModal: "+ treatsId);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <TreatDetail treatsId={treatsId} />
        {/* 리뷰 영역 */}
        <ReviewPage treatsId={treatsId} />
      </div>
    </div>
  );
};

export default Modal;
