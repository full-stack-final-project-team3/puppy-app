import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import styles from "./UserEdit.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import DeleteAccountModal from "./DeleteAccountModal"; // 모달 컴포넌트 import
import UserModal from "./UserModal";
import UserEditSkeleton from "./UserEditSkeleton.js"; // 모달 컴포넌트 import

const UserEdit = () => {
    const user = useSelector(state => state.userEdit.userDetail);

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const fileInputRef = useRef();
    const pointInputRef = useRef();
    const detailRef = useRef();
    const [profileUrl, setProfileUrl] = useState(user.profileUrl);
    const [nickname, setNickname] = useState(user.nickname);
    const [address, setAddress] = useState(user.address);
    const [detailAddress, setDetailAddress] = useState('');
    const [phoneNum, setPhoneNum] = useState(user.phoneNumber);
    const [name, setName] = useState(user.realName);
    const [point, setPoint] = useState(user.point);
    const [formattedPoint, setFormattedPoint] = useState(`${new Intl.NumberFormat('ko-KR').format(user.point)}p`);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(address + detailAddress); // 주소와 상세주소가 합쳐진 값을 출력
    }, [address, detailAddress]); // address와 detailAddress가 변경될 때마다 실행

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 850); // 850ms 후에 loading을 false로 설정
        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리
    }, []); // 컴포넌트가 처음 로딩될 때만 실행

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

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddress += (extraAddress !== '' ? `, ${extraAddress}` : data.buildingName);
                    }
                    fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                }

                setAddress(fullAddress);
            }
        }).open();
    };

    const detailAddressHandler = (e) => {
        setDetailAddress(e.target.value);
        console.log(detailAddress)
        setIsSubmitDisabled(false);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
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
            reader.readAsDataURL(file);
            setIsSubmitDisabled(false);
        }
    };

    const handleSubmit = async () => {
        const payload = {
            email: user.email,
            address: address + ' ' + detailAddress,
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
                setModalText("변경 성공!");
                setShowModal(true);
            } else {
                setModalText("변경 실패!");
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
            setModalText("변경 실패!");
            setShowModal(true);
        }
    };

    const dropUserHandler = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    const handleConfirmModal = () => {
        setShowModal(false);
        handleSubmit(); // 확인 버튼 클릭 시 handleSubmit 실행
    };

    const handleCloseModal = () => {
        setShowModal(false); // 모달 닫음
    };



    if (loading) {
        return (
            <UserEditSkeleton/>
        );
    }


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
                        <label htmlFor="password" className={styles.label}>비밀번호 변경</label>
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
                        <label htmlFor="nickname" className={styles.label}>닉네임</label>
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
                        <label htmlFor="confirmPassword" className={styles.label}>비밀번호 확인</label>
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
                        <label htmlFor="name" className={styles.label}>이름</label>
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
                        <label htmlFor="phone" className={styles.label}>휴대전화</label>
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
                        <label htmlFor="point" className={styles.label}>포인트</label>
                        <input
                            id="point"
                            type="text"
                            value={formattedPoint}
                            className={styles.input}
                            placeholder="0"
                            onChange={handlePointInputChange}
                            ref={pointInputRef}
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <label htmlFor="address" className={styles.address}>주소</label>
                    <div className={styles.inputWithButton}>
                        <input
                            id="address"
                            type="text"
                            className={styles.input}
                            value={address}
                            onChange={handleInputChange(setAddress)}
                        />
                        <button onClick={handleAddressSearch} className={styles.addressButton}>
                            주소 검색
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <label htmlFor="detailAddress" className={styles.address}>상세 주소</label>
                    <input
                        ref={detailRef}
                        id="detailAddress"
                        type="text"
                        className={styles.input}
                        value={detailAddress}
                        onChange={detailAddressHandler}
                    />
                </div>

                <div className={styles.flex}>
                    <button
                        className={styles.submitButton}
                        onClick={() => setShowModal(true)}
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
            {isModalOpen && <DeleteAccountModal onClose={closeModal}/>} {/* 모달 컴포넌트 추가 */}

            {showModal && (
                <UserModal
                    title="성공적으로 수정 되었습니다"
                    message={modalText}
                    onConfirm={handleConfirmModal}  // 모달 닫기 시 handleSubmit 실행
                    onClose={handleCloseModal}    // 모달 닫기
                    confirmButtonText="확인"
                    showCloseButton={false}       // 닫기 버튼 표시 여부
                />
            )}
        </div>
    );
};

export default UserEdit;