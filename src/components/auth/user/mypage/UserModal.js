import React from 'react';
import PropTypes from 'prop-types';
import styles from './UserModal.module.scss';

const UserModal = ({ title, message, onConfirm, onClose, confirmButtonText = "확인", showCloseButton = true }) => {
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <p className={styles.modalMessage}>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.confirmButton} onClick={onConfirm}>{confirmButtonText}</button>
                    {showCloseButton && (
                        <button className={styles.closeButton} onClick={onClose}>취소</button>
                    )}
                </div>
            </div>
        </div>
    );
};

UserModal.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    confirmButtonText: PropTypes.string,
    cancelButtonText: PropTypes.string,
    isConfirm: PropTypes.bool, // 모달이 alert인지 confirm인지 결정하는 prop
};

export default UserModal;