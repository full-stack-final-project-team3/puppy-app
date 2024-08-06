import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import styles from "./UserEdit.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import DeleteAccountModal from "./DeleteAccountModal"; // 모달 컴포넌트 import

const UserEdit = () => {

    const user = useSelector(state => state.userEdit.userDetail);
    console.log(user)

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const fileInputRef = useRef();
    const pointInputRef = useRef(); // 포인트 입력 필드의 참조를 추가합니다.
    const [profileUrl, setProfileUrl] = useState(user.profileUrl);
    const [nickname, setNickname] = useState(user.nickname);
    const [address, setAddress] = useState(user.address);
    const [phoneNum, setPhoneNum] = useState(user.phoneNumber);
    const [name, setName] = useState(user.realName);
    const [point, setPoint] = useState(user.point);
    const [formattedPoint, setFormattedPoint] = useState(`${new Intl.NumberFormat('ko-KR').format(user.point)}p`);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

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

    const handleInputChange = (setter) => (e) => {
        let value = e.target.value.replace(/,/g, '').replace('p', '');
        setter(parseInt(value, 10) || 0);
        setFormattedPoint(`${new Intl.NumberFormat('ko-KR').format(value)}p`);
        setIsSubmitDisabled(false);
    };

    const handlePointInputChange = (e) => {
        let value = e.target.value.replace(/,/g, '').replace('p', '');
        value = parseInt(value, 10) || 0;

        setPoint(value);
        setFormattedPoint(`${new Intl.NumberFormat('ko-KR').format(value)}p`);
        setIsSubmitDisabled(false);

        // 현재 커서 위치 저장
        const cursorPosition = e.target.selectionStart;

        // 상태가 업데이트된 후 커서 위치 조정
        setTimeout(() => {
            pointInputRef.current.selectionStart = pointInputRef.current.selectionEnd = cursorPosition;
        }, 0);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileUrl(reader.result);
            };
            console.log(file)
            console.log(profileUrl)
            reader.readAsDataURL(file);
            setIsSubmitDisabled(false);
        }
    };

    const clearEditMode = async () => {
        const payload = {
            email: user.email,
            address,
            password: passwordRef.current.value,
            nickname,
            phoneNumber: phoneNum,
            realName: name,
            point: point,
            profileUrl: profileUrl,
        };

        try {
            const response = await fetch(`${AUTH_URL}/${user.email}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.text();
            if (result === "success") {
                dispatch(userEditActions.updateUserDetail({ ...user, ...payload }));
                dispatch(userEditActions.clearMode());
                dispatch(userEditActions.clearUserEditMode());
                alert("변경 성공!");
            } else {
                alert("변경 실패!");
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            alert("변경 실패!");
        }
    };

    const dropUserHandler = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    return (
        <div className={styles.wrap}>
            <h2 className={styles.title}>회원 정보 수정</h2>
            <div className={styles.profileContainer}>
                <img className={styles.profile} src={profileUrl} alt="Profile" onClick={handleImageClick} />
                <div className={styles.hoverText} onClick={handleImageClick}>프로필사진 교체하기</div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
            <div className={styles.form}>
                <div className={styles.section}>
                    <label htmlFor="email">이메일</label>
                    <input id="email" type="text" className={styles.input} value={user.email} readOnly/>
                </div>
                <div className={styles.doubleSection}>
                    <div className={styles.section}>
                        <label htmlFor="password">비밀번호 변경</label>
                        <input
                            id="password"
                            type="password"
                            className={styles.input}
                            ref={passwordRef}
                            onChange={handlePasswordChange}
                            placeholder="바꾸실 비밀번호를 입력해주세요."
                        />
                    </div>
                    <div className={styles.section}>
                        <label htmlFor="nickname">닉네임</label>
                        <input
                            id="nickname"
                            type="text"
                            className={styles.input}
                            value={nickname}
                            onChange={handleInputChange(setNickname)}
                        />
                    </div>
                </div>
                <div className={styles.doubleSection}>
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
                        <label htmlFor="name">이름</label>
                        <input
                            id="name"
                            type="text"
                            className={styles.input}
                            value={name}
                            onChange={handleInputChange(setName)}
                        />
                    </div>
                </div>
                <div className={styles.doubleSection}>
                    <div className={styles.section}>
                        <label htmlFor="phone">휴대전화</label>
                        <input
                            id="phone"
                            type="text"
                            value={phoneNum}
                            className={styles.input}
                            placeholder="ex) 01055551111"
                            onChange={handleInputChange(setPhoneNum)}
                        />
                    </div>
                    <div className={styles.section}>
                        <label htmlFor="point">포인트</label>
                        <input
                            id="point"
                            type="text"
                            value={formattedPoint}
                            className={styles.input}
                            placeholder="0"
                            onChange={handlePointInputChange}
                            ref={pointInputRef} // 포인트 입력 필드의 참조를 추가합니다.
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <label htmlFor="address" className={styles.address}>주소</label>
                    <input
                        id="address"
                        type="text"
                        className={styles.input}
                        value={address}
                        onChange={handleInputChange(setAddress)}
                    />
                </div>
                <div className={styles.flex}>
                    <button
                        className={styles.submitButton}
                        onClick={clearEditMode}
                        disabled={isSubmitDisabled}
                    >
                        완료
                    </button>
                    <button
                        className={styles.submitButton}
                        onClick={dropUserHandler}
                    >
                        회원탈퇴
                    </button>
                </div>
            </div>
            {isModalOpen && <DeleteAccountModal onClose={closeModal} />} {/* 모달 컴포넌트 추가 */}
        </div>
    );
};

export default UserEdit;