import React from 'react';
import styles from "../user/mypage/AboutDog.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { dogEditActions } from "../../store/dog/DogEditSlice";
import { userEditActions } from "../../store/user/UserEditSlice";
import { DOG_URL } from "../../../config/user/host-config";
import { translateBreed } from "./dogUtil";

const DogList = () => {
    const dispatch = useDispatch();
    const dogList = useSelector(state => state.userEdit.userDetail.dogList);

    const startEditMode = async (dogId) => {
        try {
            const response = await fetch(`${DOG_URL}/${dogId}`, {
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
    };

    return (
        <>
            {dogList && dogList.length > 0 ? (
                dogList.map(dog => (
                    <div key={dog.id} className={styles.mainContainer}>
                        <img className={styles.img} src={dog.dogProfileUrl || "/header-logo.png"} alt="Dog Profile" />
                        <div className={styles.wrapRight}>
                            <div className={styles.flex}>
                                <h3 className={styles.nickname}>{dog.dogName}</h3>
                                <span className={styles.modify} onClick={() => startEditMode(dog.id)}>수정</span>
                            </div>
                            <div className={styles.age}>{dog.age}년 {dog.month}개월</div>
                            <span className={styles.breed}>{translateBreed(dog.dogBreed)}</span>
                        </div>
                    </div>
                ))
            ) : (
                <div>강아지가 없습니다.</div>
            )}
        </>
    );
};

export default DogList;