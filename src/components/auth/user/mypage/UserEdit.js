import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import styles from "./UserEdit.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import {updateHotelData} from "../../../store/hotel/HotelAddSlice";

const UserEdit = ({ user }) => {
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    console.log(user)

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


    // 주소 찾기
    const openKakaoAddress = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                dispatch(updateHotelData({ location: data.address }));
            }
        }).open();
    };

    const nameHandler = e => {
        setName(e.target.value)
        setIsSubmitDisabled(false);
    }

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
        dispatch(userEditActions.clearMode());
        dispatch(userEditActions.clearUserEditMode());

        const payload = {
            "email": user.email,
            "address": address,
            "password": passwordRef.current.value,
            "nickname": nickname,
            "phoneNumber": phoneNum,
            "realName": name,
        };

        console.log(`${AUTH_URL}/${user.email}`)
        console.log(payload)

        const response = await fetch(`${AUTH_URL}/${user.email}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            alert("변경 성공!");
        } else {
            alert("변경 실패!");
        }
    };

    return (
        <div className={styles.wrap}>
            <h2 className={styles.title}>회원 정보 수정</h2>
            <div className={styles.section}>
                <label htmlFor="email">이메일</label>
                <input id="email" type="text" value={user.email} readOnly />
            </div>
            <div className={styles.section}>
                <label htmlFor="password">비밀번호 변경</label>
                <input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    onChange={handlePasswordChange}
                    placeholder={"바꾸실 비밀번호를 입력해주세요."}
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
                    value={nickname}
                    onChange={handleNicknameChange}
                />
            </div>
            <div className={styles.section}>
                <label htmlFor="name">이름</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={nameHandler}
                />
            </div>
            <div className={styles.section}>
                <label htmlFor="address">주소</label>
                <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                />

                <div className={styles.locationContainer}>
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        required
                    />
                    <button type="button" onClick={openKakaoAddress}>Find Address</button>
                </div>


            </div>
            <div className={styles.section}>
                <label htmlFor="phone">휴대전화</label>
                <input
                    id="phone"
                    type="text"
                    value={phoneNum}
                    onChange={handlePhoneNumChange}
                />
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

