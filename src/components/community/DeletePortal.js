import ReactDOM from "react-dom";
import styles from "../../pages/community/BoardDetailPage.module.scss";

const DeletePortal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>삭제</h3>
        <p>정말로 삭제하시겠습니까?</p>
        <button onClick={onDelete}>삭제</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>,
    document.body
  );
};

export default DeletePortal;
