import React, {useRef, useState} from 'react';
import styles from './DeleteAccountModal.module.scss';

const DeleteAccountModal = ({ onClose }) => {

    const [error, setError] = useState("")
    const modalRef = useRef();

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleClickInside = () => {
        onClose();
    }

    return (
        <div className={styles.overlay} onClick={handleClickOutside}>
            <div className={styles.modal} ref={modalRef}>
                <h2 className={styles.h2}>정말 탈퇴하시겠습니까?</h2>
                <p className={styles.p}>탈퇴하시려면 현재 비밀번호를 입력해주세요.</p>
                <input type="password" placeholder="현재 비밀번호" className={styles.input}/>
                <p>{error}</p>
                <div className={styles.flex}>
                    <button className={styles.confirmButton}>확인</button>
                    <button className={styles.confirmButton} onClick={handleClickInside}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;