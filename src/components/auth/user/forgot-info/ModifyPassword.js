import React, {useRef, useState, useEffect, useContext} from 'react';
import styles from './ModifyPassword.module.scss';
import {AUTH_URL, NOTICE_URL} from "../../../../config/user/host-config";
import { useNavigate } from "react-router-dom";
import {userEditActions} from "../../../store/user/UserEditSlice";
import {useDispatch} from "react-redux";
import UserContext from "../../../context/user-context";

const ModifyPassword = ({ email }) => {
    const navi = useNavigate();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState(' ');
    const [password, setPassword] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const dispatch = useDispatch();
    const { changeIsLogin, setUser } = useContext(UserContext);

    useEffect(() => {
        if (!email) {
            navi('/');  // 이메일이 없으면 홈으로 리다이렉트
        }
    }, [email, navi]);

    const handlePasswordChange = () => {
        if (passwordRef.current.value && confirmPasswordRef.current.value) {
            if (passwordRef.current.value === confirmPasswordRef.current.value) {
                setPasswordMatch(true);
                setPasswordMessage('비밀번호가 일치합니다.');
                setPassword(passwordRef.current.value);
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
        const response = await fetch(`${AUTH_URL}/password?password=${password}&email=${email}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await response.text();
        console.log(result);

        const userDetailResponse = await fetch(`${AUTH_URL}/${email}`);
        const userDetailData = await userDetailResponse.json();

        const noticeResponse = await fetch(`${NOTICE_URL}/user/${userDetailData.id}`);
        const noticeData = await noticeResponse.json();

        dispatch(userEditActions.saveUserNotice(noticeData));
        dispatch(userEditActions.updateUserDetail(userDetailData));

        console.log(userDetailResponse);
        localStorage.setItem("userData", JSON.stringify(userDetailData));
        setUser(userDetailData);
        changeIsLogin(true);
        navi("/");
    };

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
                    placeholder="바꾸실 비밀번호를 입력해주세요."
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
                    placeholder="비밀번호를 다시 입력해주세요."
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