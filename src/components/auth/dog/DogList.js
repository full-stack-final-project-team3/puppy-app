import React from 'react';
import styles from "../user/mypage/AboutDog.module.scss";
import {useDispatch} from "react-redux";
import {dogEditActions} from "../../store/dog/DogEditSlice";
import {userEditActions} from "../../store/user/UserEditSlice";

const DogList = ({dog}) => {

    const dispatch = useDispatch();

    const startEditMode = e => {
        dispatch(dogEditActions.startEdit())
        dispatch(userEditActions.startMode())
    }



    return (
        <div key={dog.id} className={styles.mainContainer} data-dno={dog.id}>
            <img className={styles.img} src={dog.dogProfileUrl}></img>
            <div className={styles.wrapRight}>
                <div className={styles.flex}>
                    <h3 className={styles.nickname}>{dog.dogName}</h3>
                    <span className={styles.modify} onClick={startEditMode}>수정</span>
                </div>
                <span className={styles.breed}>{dog.dogBreed}</span>
            </div>
        </div>
    );
};

export default DogList;