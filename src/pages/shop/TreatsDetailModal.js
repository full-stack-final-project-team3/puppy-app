import React from "react";
import ReactDOM from "react-dom";
import styles from "./TreatsDetailModal.module.scss"; // 스타일 파일이 필요합니다.
import TreatDetail from "./TreatsDetail";
import ReviewPage from "./review/ReviewPage";

const Modal = ({
  isOpen,
  onClose,
  treatsId,
  toggleTreatSelection,
}) => {

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // 항상 화면 중앙에 위치하게 합니다.
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

  return ReactDOM.createPortal(modalContent, document.body); // 포탈로 모달을 렌더링
};

export default Modal;
