import React from "react";
import styles from "./TreatsDetailModal.module.scss"; // 스타일 파일이 필요합니다.
import TreatDetail from "./TreatsDetail";
import ReviewPage from "./review/ReviewPage";

const Modal = ({
  isOpen,
  onClose,
  treatsId,
  modalPosition,
  toggleTreatSelection,
}) => {

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{
          top: modalPosition?.y || 0,
          left: "50%",
          transform: "translate(-50%, -3%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <TreatDetail
          treatsId={treatsId}
          toggleTreatSelection={toggleTreatSelection}
        />
        {/* 리뷰 영역 */}
        <ReviewPage treatsId={treatsId} />
      </div>
    </div>
  );
};

export default Modal;
