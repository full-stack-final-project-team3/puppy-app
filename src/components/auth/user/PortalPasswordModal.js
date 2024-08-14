import React from 'react';
import ReactDOM from 'react-dom';
import styles from './PortalPasswordModal.module.scss'; // 모달 스타일을 위한 CSS 모듈

const PortalPasswordModal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default PortalPasswordModal;