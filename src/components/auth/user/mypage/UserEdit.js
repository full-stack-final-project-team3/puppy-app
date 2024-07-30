import React, { useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import styles from "./UserEdit.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";

const UserEdit = ({ user }) => {
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [nickname, setNickname] = useState(user.nickname);
    const [address, setAddress] = useState(user.address);
    const [phoneNum, setPhoneNum] = useState(user.phoneNumber);
    const [name, setName] = useState(user.realName);

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

    const nameHandler = (e) => {
        setName(e.target.value);
        setIsSubmitDisabled(false);
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setIsSubmitDisabled(false);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        setIsSubmitDisabled(false);
    };

    const handlePhoneNumChange = (e) => {
        setPhoneNum(e.target.value);
        setIsSubmitDisabled(false);
    };

    const clearEditMode = async () => {
        const payload = {
            email: user.email,
            address,
            password: passwordRef.current.value,
            nickname,
            phoneNumber: phoneNum,
            realName: name,
        };

        try {
            const response = await fetch(`${AUTH_URL}/${user.email}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.text();
            try {
                const jsonResult = JSON.parse(result);
                dispatch(userEditActions.updateUserDetail({ ...user, ...jsonResult }));
                dispatch(userEditActions.clearMode());
                dispatch(userEditActions.clearUserEditMode());
                alert("변경 성공!");
            } catch (e) {
                if (result === "success") {
                    dispatch(userEditActions.updateUserDetail({ ...user, ...payload }));
                    dispatch(userEditActions.clearMode());
                    dispatch(userEditActions.clearUserEditMode());
                    alert("변경 성공!");
                } else {
                    alert("알 수 없는 응답 형식: " + result);
                }
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("변경 실패!");
        }
    };

    return (
        <div className={styles.wrap}>
            <img className={styles.img} src="/header-logo.png" alt="Header Logo"/>
            <h2 className={styles.title}>회원 정보 수정</h2>

            <div className={styles.flex}>
                <div className={styles.section}>
                    <label htmlFor="email">이메일</label>
                    <input id="email" type="text" className={styles.input} value={user.email} readOnly/>
                </div>
                <div className={styles.section}>
                    <label htmlFor="name">이름</label>
                    <input
                        id="name"
                        type="text"
                        className={styles.input}
                        value={name}
                        onChange={nameHandler}
                    />
                </div>
                <div className={styles.section}>
                    <label htmlFor="password">비밀번호 변경</label>
                    <input
                        id="password"
                        type="password"
                        className={styles.input}
                        ref={passwordRef}
                        onChange={handlePasswordChange}
                        placeholder={"바꾸실 비밀번호를 입력해주세요."}
                    />
                </div>

                <div className={styles.section}>
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        id="nickname"
                        type="text"
                        className={styles.input}
                        value={nickname}
                        onChange={handleNicknameChange}
                    />
                </div>
                <div className={styles.section}>
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className={styles.input}
                        ref={confirmPasswordRef}
                        onChange={handlePasswordChange}
                    />
                    {passwordMessage && (
                        <p className={passwordMatch ? styles.successMessage : styles.errorMessage}>
                            {passwordMessage}
                        </p>
                    )}
                </div>

                <div className={styles.section}>
                    <label htmlFor="phone">휴대전화</label>
                    <input
                        id="phone"
                        type="text"
                        value={phoneNum}
                        className={styles.input}
                        placeholder={"ex) 01055551111"}
                        onChange={handlePhoneNumChange}
                    />
                </div>
            </div>
            <div className={styles.section}>
                <label htmlFor="address" className={styles.address}>주소</label>
                <input
                    id="address"
                    type="text"
                    className={styles.addressName}
                    value={address}
                    onChange={handleAddressChange}
                />
            </div>
            {/*<div >*/}
            {/*    <div >*/}
            {/*        <img src="/assets/img/image-add.png" alt="프로필 썸네일"/>*/}
            {/*        <span ></span>*/}
            {/*    </div>*/}

            {/*    <label>프로필 이미지 추가</label>*/}

            {/*    <input*/}
            {/*        type="file"*/}
            {/*        id="profile-img"*/}
            {/*        accept="image/*"*/}
            {/*        name="profileImage"*/}
            {/*    />*/}
            {/*</div>*/}
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