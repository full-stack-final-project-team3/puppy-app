import React, {useRef, useState} from 'react';
import styles from './ModifyPassword.module.scss';
import {AUTH_URL} from "../../../../config/user/host-config";
import {useNavigate} from "react-router-dom";

const ModifyPassword = ({ email }) => {


    console.log(email) // email이 undefined


    const navi = useNavigate();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [password, setPassword] = useState('');



    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const handlePasswordChange = () => {
        if (passwordRef.current.value && confirmPasswordRef.current.value) {
            if (passwordRef.current.value === confirmPasswordRef.current.value) {
                setPasswordMatch(true);
                setPasswordMessage('비밀번호가 일치합니다.');
                setPassword(passwordRef.current.value)
                setIsSubmitDisabled(false);
            } else {
                setPasswordMatch(false);
                setPasswordMessage('비밀번호가 일치하지 않습니다.');
                setIsSubmitDisabled(true);
            }
        } else {
            setPasswordMessage('');
            setIsSubmitDisabled(true);
        }
    };

    const submitHandler = async () => {
        // 패치 보냄

        // gksrlqja3#
        console.log(email) // email이 null
        console.log(password)

        const response = await fetch(`${AUTH_URL}/password?password=${password}&email=${email}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },

        });
        const result = await response.text();
        console.log(result);
        navi("/");
    }

    return (
        <div className={styles.authContainer}>
            <p>새롭게 설정할 비밀번호를 입력해주세요.</p>
            <div className={styles.section}>
                <label htmlFor="password" className={styles.label}>비밀번호 변경</label>
                <input
                    className={styles.input}
                    id="password"
                    type="password"
                    ref={passwordRef}
                    onChange={handlePasswordChange}
                    placeholder={"바꾸실 비밀번호를 입력해주세요."}
                />
            </div>
            <div className={styles.section}>
                <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
                <input
                    className={styles.input}
                    id="confirmPassword"
                    type="password"
                    ref={confirmPasswordRef}
                    onChange={handlePasswordChange}
                />
                {passwordMessage && (
                    <p className={passwordMatch ? styles.successMessage : styles.errorMessage}>
                        {passwordMessage}
                    </p>
                )}
            </div>
            <button
                className={styles.submitButton}
                disabled={isSubmitDisabled}
                onClick={submitHandler}
            >
                완료
            </button>
        </div>
    );
};

export default ModifyPassword;