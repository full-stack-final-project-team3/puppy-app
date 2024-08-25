import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './UserModal.module.scss';

const UserModal = ({ title, message, onConfirm, onClose, confirmButtonText = "확인", showCloseButton = true }) => {

    useEffect(() => {
        const onEnterClose = (e) => {
            if (e.key === 'Enter' && !title.includes("강아지가")) {
                onClose();
            }
        };

        window.addEventListener('keydown', onEnterClose);

        return () => {
            window.removeEventListener('keydown', onEnterClose);
        };
    }, [onClose]);

    return ReactDOM.createPortal(
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <p className={styles.modalMessage}>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.confirmButton} onClick={onConfirm}>{confirmButtonText}</button>
                    {showCloseButton && (
                        <button className={styles.closeButton} onClick={onClose}>취소</button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

UserModal.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    confirmButtonText: PropTypes.string,
    showCloseButton: PropTypes.bool,
};

export default UserModal;
