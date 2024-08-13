import React from 'react';
import PropTypes from 'prop-types';
import styles from './scss/OrderModal.module.scss';



const OrderModal = ({ title, message, onConfirm, onClose, confirmButtonText, showCloseButton }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          {onConfirm && (
            <button onClick={onConfirm} className={styles.confirmButton}>
              {confirmButtonText || '확인'}
            </button>
          )}
          {showCloseButton && (
            <button onClick={onClose} className={styles.closeButton}>
              아니요
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

OrderModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
  confirmButtonText: PropTypes.string,
  showCloseButton: PropTypes.bool,
};

export default OrderModal;
