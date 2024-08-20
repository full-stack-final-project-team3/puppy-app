import React from 'react';
import ReactDOM from 'react-dom';
import styles from './NoticeModal.module.scss';

const NoticeModal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>

                {children}

        </div>,
        document.body
    );
};

export default NoticeModal;