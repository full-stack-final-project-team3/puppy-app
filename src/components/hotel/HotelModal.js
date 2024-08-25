import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './HotellModal.module.scss';
import ReactDOM from 'react-dom';

const HotelModal = ({ title, message, onConfirm, onClose, confirmButtonText = "예", showCloseButton = true }) => {
    useEffect(() => {
        // 모달이 뜰 때 화면을 맨 위로 스크롤
        window.scrollTo(0, 0);
    }, []);

    return ReactDOM.createPortal (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>{title}</h2>
                <p className={styles.modalMessage}>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.confirmButton} onClick={onConfirm}>{confirmButtonText}</button>
                    {showCloseButton && (
                        <button className={styles.closeButton} onClick={onClose}>아니요</button>
                    )}
                </div>
            </div>
        </div>,
        document.body // 포탈이 렌더링될 노드
    );
};

HotelModal.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    confirmButtonText: PropTypes.string,
    showCloseButton: PropTypes.bool,
};

export default HotelModal;
