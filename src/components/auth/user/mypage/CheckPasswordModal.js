import React, { useRef, useState } from 'react';
import styles from './CheckPasswordModal.module.scss';
import { debounce } from "lodash";
import { AUTH_URL } from "../../../../config/user/host-config";
import { useSelector } from "react-redux";
import PortalPasswordModal from "../PortalPasswordModal";

const CheckPasswordModal = ({ onClose, cancelEdit }) => {
    const user = useSelector(state => state.userEdit.userDetail);
    const [error, setError] = useState("");
    const [isValid, setIsValid] = useState(false);
    const modalRef = useRef();

    const checkPassword = debounce(async (password) => {
        const response = await fetch(`${AUTH_URL}/check-password/${user.email}?password=${password}`);
        const flag = await response.json();

        if (flag) {
            setIsValid(true);
            onClose(false); // 모달을 닫으며 다음 단계로 이동
        } else {
            setIsValid(false);
            setError("비밀번호가 틀렸습니다.");
        }
    }, 300);

    const changeHandler = (e) => {
        const password = e.target.value;
        if (password.length === 0) {
            setIsValid(false);
            setError('');
        }
        checkPassword(password);
    };

    const cancel = () => {
        cancelEdit(false);
    }

    return (
        <PortalPasswordModal onClose={cancel}> {/* PortalModal을 통해 모달 렌더링 */}
            <h2 className={styles.h2}>현재 비밀번호를 입력해주세요.</h2>
            <input
                type="password"
                placeholder="현재 비밀번호"
                className={styles.input}
                onChange={changeHandler}
            />
            {!isValid && <p className={styles.error}>{error}</p>}
            <div className={styles.flex}>
                <button className={styles.confirmButton} onClick={cancel}>취소</button>
            </div>
        </PortalPasswordModal>
    );
};

export default CheckPasswordModal;