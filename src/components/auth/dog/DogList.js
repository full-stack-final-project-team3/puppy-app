import React from 'react';
import styles from "../user/mypage/AboutDog.module.scss";
import {useDispatch} from "react-redux";
import {dogEditActions} from "../../store/dog/DogEditSlice";
import {userEditActions} from "../../store/user/UserEditSlice";
import {DOG_URL} from "../../../config/user/host-config";
import { translateBreed } from "./dogUtil";

const DogList = ({dog}) => {
    const dispatch = useDispatch();

    const startEditMode = async () => {
        try {
            const response = await fetch(`${DOG_URL}/${dog.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);

                // 여기에 JSON 파싱을 수행
                const dogInfo = JSON.stringify(result);

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

    return (
        <div key={dog.id} className={styles.mainContainer} >
            <img className={styles.img} src={dog.dogProfileUrl} alt="Dog Profile" />
            <div className={styles.wrapRight}>
                <div className={styles.flex}>
                    <h3 className={styles.nickname}>{dog.dogName}</h3>
                    <span className={styles.modify} onClick={startEditMode}>수정</span>
                </div>
                <span className={styles.breed}>{translateBreed(dog.dogBreed)}</span>
            </div>
        </div>
    );
};

export default DogList;