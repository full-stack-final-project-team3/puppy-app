import React, { useState } from 'react';
import Portal from '../Portal';
import styles from './DeleteAccountModal.module.scss';
import { debounce } from "lodash";
import { AUTH_URL } from "../../../../config/user/host-config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ onClose }) => {
    const user = useSelector(state => state.userEdit.userDetail);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const navi = useNavigate();

    const checkPassword = debounce(async (password) => {
        const response = await fetch(`${AUTH_URL}/check-password/${user.email}?password=${password}`);
        const flag = await response.json();

        if (flag) {
            setIsValid(true);
            setIsSubmitDisabled(false);
            setSuccess("비밀번호가 일치합니다. 회원탈퇴 하시겠습니까?");
        } else {
            setIsValid(false);
            setIsSubmitDisabled(true);
            setError("비밀번호가 틀렸습니다.");
        }
    }, 1000);

    const changeHandler = (e) => {
        const password = e.target.value;
        if (password.length === 0) {
            setIsValid(false);
            setError('');
            setSuccess('');
            setIsSubmitDisabled(true);
        }
        checkPassword(password);
    };

    const submitDeleteHandler = async () => {
        const response = await fetch(`${AUTH_URL}/${user.id}`, {
            method: "DELETE"
        });
        localStorage.removeItem('userData');
        localStorage.removeItem('userDetail');
        navi("/");
        window.location.reload();
        alert("회원탈퇴가 성공적으로 이루어졌습니다.");
    };

    return (
        <Portal>
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <h2 className={styles.h2}>정말 탈퇴하시겠습니까?</h2>
                    <p className={styles.p}>탈퇴하시려면 현재 비밀번호를 입력해주세요.</p>
                    <input
                        type="password"
                        placeholder="현재 비밀번호"
                        className={styles.input}
                        onChange={changeHandler}
                    />
                    {isValid && <p className={styles.success}>{success}</p>}
                    {!isValid && <p className={styles.error}>{error}</p>}
                    <div className={styles.flex}>
                        <button
                            className={styles.confirmButton}
                            disabled={isSubmitDisabled}
                            onClick={submitDeleteHandler}
                        >
                            확인
                        </button>
                        <button className={styles.confirmButton} onClick={onClose}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default DeleteAccountModal;