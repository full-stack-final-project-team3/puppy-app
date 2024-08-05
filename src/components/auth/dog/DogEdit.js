import React, { useRef, useState } from 'react';
import styles from './DogEdit.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../store/user/UserEditSlice";
import { dogEditActions } from "../../store/dog/DogEditSlice";
import { DOG_URL } from "../../../config/user/host-config";
import { useNavigate } from "react-router-dom";
import { decideGender, decideSize, translateAllergy, translateBreed } from './dogUtil.js';
import { LuBadgeX } from "react-icons/lu";

const DogEdit = () => {
    const [dogProfileUrl, setDogProfileUrl] = useState('');
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

    const clearEditMode = async e => {
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
            alert("수정 되었습니다.");
            const updatedDogList = userDetail.dogList.map(d => d.id === dog.id ? { ...d, weight, dogProfileUrl: payload.dogProfileUrl } : d);
            dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
            dispatch(userEditActions.clearMode());
            dispatch(dogEditActions.clearEdit());
        }
    };

    const removeHandler = async () => {
        try {
            const response = await fetch(`${DOG_URL}/${dog.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                alert("삭제 되었습니다.");
                const updatedDogList = userDetail.dogList.filter(d => d.id !== dog.id);
                dispatch(userEditActions.updateUserDetail({ ...userDetail, dogList: updatedDogList }));
                dispatch(userEditActions.clearMode());
                dispatch(dogEditActions.clearEdit());
                navigate("/mypage");
            } else {
                alert("삭제에 실패했습니다.");
                console.error('삭제 실패:', response.statusText);
            }
        } catch (error) {
            console.error('에러 발생:', error);
            alert("삭제 중 에러가 발생했습니다.");
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
                alert("강아지의 건강이 좋아졌나봐요!");
            } else {
                console.error('알러지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            console.error('알러지 삭제 중 에러 발생:', error);
        }
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
                        <button onClick={removeHandler}>삭제</button>
                        <button onClick={clearEditMode}>완료</button>
                    </div>
                </div>
                <div className={styles.right} onClick={handleImageClick}>
                    <img className={styles.dogProfileUrl} src={dog.dogProfileUrl || dogProfileUrl} alt="Dog Profile" />
                    <div className={styles.hoverText}>강아지 사진 변경</div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DogEdit;