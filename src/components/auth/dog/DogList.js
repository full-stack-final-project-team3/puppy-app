import React, { useState } from 'react';
import styles from "../user/mypage/AboutDog.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { dogEditActions } from "../../store/dog/DogEditSlice";
import { userEditActions } from "../../store/user/UserEditSlice";
import { DOG_URL } from "../../../config/user/host-config";
import { translateBreed } from "./dogUtil";
import CheckPasswordModal from "../user/mypage/CheckPasswordModal";

const DogList = () => {
    const dispatch = useDispatch();
    const dogList = useSelector(state => state.userEdit.userDetail.dogList);
    const [showModal, setShowModal] = useState(false);
    const [selectedDogId, setSelectedDogId] = useState(null);

    const startEditMode = (dogId) => {
        setSelectedDogId(dogId);
        setShowModal(true);
    };

    const onClose = async (flag) => {
        setShowModal(false); // 모달을 닫음
        if (!flag && selectedDogId) {  // 모달이 닫힐 때만 작동
            try {
                const response = await fetch(`${DOG_URL}/${selectedDogId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const dogInfo = await response.json();
                    dispatch(dogEditActions.setDogInfo(dogInfo));
                    dispatch(dogEditActions.startEdit());
                    dispatch(userEditActions.startMode());
                } else {
                    console.error('Failed to fetch dog info');
                }
            } catch (error) {
                console.error('Error fetching dog info:', error);
            }
        }
    };

    const cancelEdit = () => {
        setShowModal(false);
    }

    return (
        <>
            {dogList && dogList.length > 0 ? (
                dogList.map(dog => (
                    <div key={dog.id} className={styles.mainContainer}>
                        <div className={`${styles.imgWrap}  ${dog.dogProfileUrl !== null && styles.circle}`}>
                            <img className={styles.img} src={dog.dogProfileUrl || "/header-logo.png"}
                                alt="Dog Profile"/>
                        </div>
                        <div className={styles.wrapRight}>
                            <div className={styles.flex}>
                                <h3 className={styles.nickname}>{dog.dogName}</h3>
                                <span className={styles.modify} onClick={() => startEditMode(dog.id)}>수정</span>
                            </div>
                            <div className={styles.age}>{dog.age}년 {dog.month}개월</div>
                            <span className={styles.breed}>{translateBreed(dog.dogBreed)}</span>
                        </div>
                        {showModal && selectedDogId === dog.id && (
                            <CheckPasswordModal onClose={onClose} cancelEdit={cancelEdit}/>
                        )}
                    </div>
                ))
            ) : (
                <div>강아지가 없습니다.</div>
            )}
        </>
    );
};

export default DogList;