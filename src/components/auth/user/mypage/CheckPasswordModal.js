import React, { useRef, useState } from 'react';
import styles from './CheckPasswordModal.module.scss';
import { AUTH_URL } from "../../../../config/user/host-config";
import { useSelector } from "react-redux";
import PortalPasswordModal from "../PortalPasswordModal";

const CheckPasswordModal = ({ onClose, cancelEdit }) => {
    const user = useSelector(state => state.userEdit.userDetail);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(false);


    const checkPassword = async () => {

        try {
            const response = await fetch(`${AUTH_URL}/check-password/${user.email}?password=${password}`);
            const flag = await response.json();

            if (flag) {
                setIsValid(true);
                onClose(false); // 모달을 닫으며 다음 단계로 이동
            } else {
                setIsValid(false);
                setError("비밀번호가 틀렸습니다.");
            }
        } catch (error) {
            console.error("Error checking password:", error);
            setError("비밀번호 확인 중 문제가 발생했습니다.");
        }
    };

    const changeHandler = (e) => {
        setPassword(e.target.value);
        if (e.target.value.length === 0) {
            setIsValid(false);
            setError('');
        }
    };

    const cancel = () => {
        cancelEdit(false);
    };


    const enterHandler = (e) => {
        if (e.key === "Enter") {
            checkPassword()
            console.log("zz")
        }
    };

    return (
        <PortalPasswordModal onClose={cancel}>
            <h2 className={styles.h2}>현재 비밀번호를 입력해주세요.</h2>
            <input
                type="password"
                placeholder="현재 비밀번호"
                className={styles.input}
                onChange={changeHandler}
                value={password}
                onKeyDown={enterHandler}
            />
            {!isValid && <p className={styles.error}>{error}</p>}
            <div className={styles.flex}>
                <button className={styles.confirmButton} onClick={cancel}>취소</button>
                <button
                    className={styles.confirmButton}
                    onClick={checkPassword}
                    disabled={password.length === 0}
                >
                    확인
                </button>
            </div>
        </PortalPasswordModal>
    );
};

export default CheckPasswordModal;