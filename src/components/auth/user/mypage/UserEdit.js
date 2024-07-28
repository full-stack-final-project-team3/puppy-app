import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import styles from "./UserEdit.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";

const UserEdit = ({ user }) => {
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const addressRef = useRef();
    const phoneNumRef = useRef();

    const [nickname, setNickname] = useState(user.nickname); // 닉네임 상태 추가
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const dispatch = useDispatch();

    const handlePasswordChange = () => {
        if (passwordRef.current.value && confirmPasswordRef.current.value) {
            if (passwordRef.current.value === confirmPasswordRef.current.value) {
                setPasswordMatch(true);
                setPasswordMessage('비밀번호가 일치합니다.');
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

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const clearEditMode = async () => {
        dispatch(userEditActions.clearMode());
        dispatch(userEditActions.clearUserEditMode());

        const payload = {
            "email": user.email,
            "address": addressRef.current.value,
            "password": passwordRef.current.value,
            "nickname": nickname, // 닉네임 상태 사용
            "phoneNumber": phoneNumRef.current.value
        };
        console.log(`${AUTH_URL}/${user.email}`)
        console.log(payload)

        const response = await fetch(`${AUTH_URL}/${user.email}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        alert("변경 성공!");
    };

    return (
        <div className={styles.wrap}>
            <h2 className={styles.title}>회원 정보 수정</h2>
            <div className={styles.section}>
                <label htmlFor="email">이메일</label>
                <input id="email" type="text" value={user.email} readOnly />
            </div>
            <div className={styles.section}>
                <label htmlFor="password">비밀번호</label>
                <input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    onChange={handlePasswordChange}
                />
            </div>
            <div className={styles.section}>
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                    id="confirmPassword"
                    type="password"
                    ref={confirmPasswordRef}
                    onChange={handlePasswordChange}
                />
                {passwordMessage && (
                    <p
                        className={
                            passwordMatch ? styles.successMessage : styles.errorMessage
                        }
                    >
                        {passwordMessage}
                    </p>
                )}
            </div>
            <div className={styles.section}>
                <label htmlFor="nickname">닉네임</label>
                <input
                    id="nickname"
                    type="text"
                    value={nickname} // 상태 사용
                    onChange={handleNicknameChange} // 닉네임 변경 핸들러 추가
                />
            </div>
            <div className={styles.section}>
                <label htmlFor="name">이름</label>
                <input id="name" type="text" value={user.realName} readOnly />
            </div>
            <div className={styles.section}>
                <label htmlFor="address">주소</label>
                <input id="address" ref={addressRef} type="text" />
            </div>
            <div className={styles.section}>
                <label htmlFor="phone">휴대전화</label>
                <input id="phone" ref={phoneNumRef} type="text" value={user.phoneNumber} />
            </div>
            <button
                className={styles.submitButton}
                onClick={clearEditMode}
                disabled={isSubmitDisabled}
            >
                완료
            </button>
        </div>
    );
};

export default UserEdit;