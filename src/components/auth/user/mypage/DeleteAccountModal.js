import React, {useRef, useState} from 'react';
import styles from './DeleteAccountModal.module.scss';
import {debounce} from "lodash";
import {AUTH_URL} from "../../../../config/user/host-config";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {logoutAction} from "../../../../pages/user/Logout";

const DeleteAccountModal = ({ onClose }) => {


    const user = useSelector(state => state.userEdit.userDetail);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isValid, setIsValid] = useState(false); // 검증 여부
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // 비번 일치하면 버튼 활성화
    const modalRef = useRef();
    const navi = useNavigate();

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleClickInside = () => {
        onClose();
    }
    const checkPassword = debounce(async (password) => {
        const response = await fetch(`${AUTH_URL}/check-password/${user.id}?password=${password}`);
        const flag = await response.json();

        if (flag) {
            setIsValid(true)
            setIsSubmitDisabled(false);
            setSuccess("가지마세요..")
        } else {
            setIsValid(false)
            setIsSubmitDisabled(true);
            setError("비밀번호가 틀렸습니다.")
        }

    }, 1000)

    const changeHandler = (e) => {
        const password = e.target.value;
        if (password.length === 0) {
            setIsValid(false)
            setError('')
            setSuccess('')
            setIsSubmitDisabled(false);
        }
        checkPassword(password);
    }

    const submitDeleteHandler = async () => {
        const response = await fetch(`${AUTH_URL}/${user.id}`, {
            method: "DELETE"
        });
        localStorage.removeItem('userData');
        localStorage.removeItem('userDetail');
        navi("/")
        window.location.reload();
        alert("회원탈퇴가 성공적으로 이루어졌습니다.")

        // 탈퇴는 되는데 홈으로 안가지고 에러페이지로 가짐.
    }

    return (
        <div className={styles.overlay} onClick={handleClickOutside}>
            <div className={styles.modal} ref={modalRef}>
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
                    >확인
                    </button>
                    <button className={styles.confirmButton} onClick={handleClickInside}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;