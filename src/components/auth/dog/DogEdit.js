import React, { useRef, useState } from 'react';
import styles from './DogEdit.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../store/user/UserEditSlice";
import { dogEditActions } from "../../store/dog/DogEditSlice";
import { DOG_URL } from "../../../config/user/host-config";
import { useNavigate } from "react-router-dom";
import { decideGender, decideSize, translateAllergy, translateBreed } from './dogUtil.js';
import { LuBadgeX } from "react-icons/lu";
import UserModal from "../user/mypage/UserModal"; // UserModal 컴포넌트 import

const DogEdit = () => {
    const [dogProfileUrl, setDogProfileUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');
    const [pendingFunction, setPendingFunction] = useState(null); // 모달에서 실행할 함수를 저장할 상태
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false); // 삭제 확인 모드인지 여부

    const weightRef = useRef();
    const fileInputRef = useRef();

    const dog = useSelector(state => state.dogEdit.dogInfo);
    const userDetail = useSelector(state => state.userEdit.userDetail);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDogProfileUrl(reader.result);
                const updatedDogList = userDetail.dogList.map(d => d.id === dog.id ? { ...d, dogProfileUrl: reader.result } : d);
                dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
                dispatch(dogEditActions.updateDogInfo({ ...dog, dogProfileUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const clearEditMode = async () => {
        const weight = weightRef.current.value;
        const payload = {
            weight,
            dogProfileUrl: dogProfileUrl || dog.dogProfileUrl
        };

        const response = await fetch(`${DOG_URL}/${dog.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            const updatedDogList = userDetail.dogList.map(d => d.id === dog.id ? { ...d, weight, dogProfileUrl: payload.dogProfileUrl } : d);
            dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
            dispatch(userEditActions.clearMode());
            dispatch(dogEditActions.clearEdit());
            setModalText("성공적으로 수정이 완료되었습니다.");
            setPendingFunction(() => {}); // 모달에서 실행할 함수는 없음
            setShowModal(true);
        } else {
            setModalText("수정에 실패했습니다.");
            setPendingFunction(() => {}); // 모달에서 실행할 함수는 없음
            setShowModal(true);
        }
    };

    const removeHandler = async () => {
        try {
            const response = await fetch(`${DOG_URL}/${dog.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const updatedDogList = userDetail.dogList.filter(d => d.id !== dog.id);
                dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
                dispatch(userEditActions.clearMode());
                dispatch(dogEditActions.clearEdit());
                setModalText("삭제 되었습니다.");
                setPendingFunction(() => navigate("/mypage")); // 모달에서 실행할 함수로 navigate 설정
                setShowModal(true);
            } else {
                setModalText("삭제에 실패했습니다.");
                // setPendingFunction(() => {}); // 모달에서 실행할 함수는 없음
                setShowModal(true);
            }
        } catch (error) {
            console.error('에러 발생:', error);
            setModalText("삭제 중 에러가 발생했습니다.");
            // setPendingFunction(() => {}); // 모달에서 실행할 함수는 없음
            setShowModal(true);
        }
    };

    const removeAllergy = async e => {
        const allergy = e.target.dataset.alg;

        try {
            const response = await fetch(`${DOG_URL}/allergy?allergy=${allergy}&dogId=${dog.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const updatedAllergies = dog.allergies.filter(a => a !== allergy);
                const updatedDogList = userDetail.dogList.map(d =>
                    d.id === dog.id ? { ...d, allergies: updatedAllergies } : d
                );

                dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
                dispatch(dogEditActions.updateDogInfo({ ...dog, allergies: updatedAllergies }));
                setModalText("알러지가 삭제되었습니다!");
                setPendingFunction(() => {}); // 모달에서 실행할 함수는 없음
                setShowModal(true);
            } else {
                console.error('알러지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            console.error('알러지 삭제 중 에러 발생:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmModal = () => {
        setShowModal(false);
        if (isDeleteConfirmation) {
            removeHandler(); // 삭제 확인 모드일 때 removeHandler 실행
        } else {
            if (pendingFunction) {
                pendingFunction(); // 다른 경우 pendingFunction 실행
            }
        }
    };

    const handleDeleteClick = () => {
        setModalText("정말 삭제하시겠습니까?");
        setIsDeleteConfirmation(true); // 삭제 확인 모드로 전환
        setShowModal(true);
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <img className={styles.img} src="/header-logo.png" alt="Header Logo" />
                <h2 className={styles.title}>{dog.dogName}의 정보</h2>
            </div>
            <div className={styles.flex}>
                <div className={styles.left}>
                    <div className={styles.row}>
                        <div className={styles.item}>견종</div>
                        <span className={styles.answer}>{translateBreed(dog.dogBreed)}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>생일</div>
                        <span className={styles.answer}>{dog.birthday} <span className={styles.sub}>{dog.age}년 {dog.month}개월</span></span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>성별</div>
                        <span className={styles.answer}>{decideGender(dog.dogSex)}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>체중</div>
                        <input className={styles.input} placeholder={dog.weight} type="number" ref={weightRef} />
                        <span className={styles.sub}>{decideSize(dog.dogSize)}</span>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.item}>보유 알러지</div>
                        <div className={styles.answer}>
                            {Array.isArray(dog.allergies) ? dog.allergies.map((allergy, index) => (
                                <span key={index} className={styles.badge}>
                                    {translateAllergy(allergy)}
                                    <LuBadgeX className={styles.icon} onClick={removeAllergy} data-alg={allergy} />
                                </span>
                            )) : <span className={styles.answer}>없음</span>}
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        <button onClick={handleDeleteClick}>삭제</button>
                        <button onClick={() => {
                            setPendingFunction(() => clearEditMode);
                            setShowModal(true); // 모달을 먼저 열고, 확인 버튼을 눌렀을 때 clearEditMode 실행
                        }}>완료</button>
                    </div>
                </div>
                <div className={styles.right} onClick={handleImageClick}>
                    <img className={styles.dogProfileUrl} src={dog.dogProfileUrl || "header-logo.png"} alt="Dog Profile" />
                    <div className={styles.hoverText}>강아지 사진 변경</div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {showModal && (
                <UserModal
                    title={isDeleteConfirmation ? "삭제 확인" : "성공적으로 수정이 완료되었습니다."}
                    message={modalText}
                    onConfirm={handleConfirmModal}
                    onClose={handleCloseModal}
                    confirmButtonText={isDeleteConfirmation ? "예" : "확인"}
                    showCloseButton={isDeleteConfirmation} // 삭제 확인 모드일 때는 "아니요" 버튼도 표시
                />
            )}
        </div>
    );
};

export default DogEdit;