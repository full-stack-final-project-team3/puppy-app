import React from 'react';
import styles from './DogEdit.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {userEditActions} from "../../store/user/UserEditSlice";
import {dogEditActions} from "../../store/dog/DogEditSlice";

const DogEdit = () => {

    const dog = useSelector(state => state.dogEdit.dogInfo);

    const dispatch = useDispatch();
    const clearEditMode = e => {
        dispatch(userEditActions.clearMode())
        dispatch(dogEditActions.clearEdit())
    }

    const decideGender = (gender) => {
        switch (gender) {
            case "FEMALE":
                return "암컷";
            case "MALE":
                return "수컷";
            case "NEUTER":
                return "비밀";
            default:
                return "";
        }
    }

    const decideSize = (size) => {
        switch (size) {
            case "SMALL":
                return "소형견";
            case "MEDIUM":
                return "중형견";
            case "LARGE":
                return "대형견";
            default:
                return "";
        }
    }

    return (
        <div>
            <div className={styles.wrap}>
                <img className={styles.img} src="/header-logo.png" alt="Header Logo"/>
                <div className={styles.flex}>
                    <div className={styles.left}>
                        <h2 className={styles.title}>{dog.dogName}의 정보</h2>
                        <div className={styles.row}>
                            <div className={styles.item}>견종</div>
                            <span className={styles.answer}>{dog.dogBreed}</span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>생일</div>
                            <span className={styles.answer}>{dog.birthday} <span
                                className={styles.sub}>{dog.age}세</span></span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>성별</div>
                            <span className={styles.answer}>{decideGender(dog.dogSex)}</span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>체중</div>
                            <input className={styles.input} value={dog.weight} type="number"/> <span
                            className={styles.sub}>{decideSize(dog.dogSize)}</span>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.item}>보유 알러지</div>
                            <span className={styles.answer}>{dog.allergies}</span>
                        </div>
                    </div>
                    <div className={styles.right}>
                        <img className={styles.dogProfileUrl} src={dog.dogProfileUrl}/>
                    </div>
                </div>
                <button>강아지 삭제</button>
                <button onClick={clearEditMode}>완료</button>
            </div>
        </div>
    );
};

export default DogEdit;