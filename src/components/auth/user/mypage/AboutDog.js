import React from 'react';
import styles from './AboutDog.module.scss';
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {dogEditActions} from "../../../store/dog/DogEditSlice";
import {userEditActions} from "../../../store/user/UserEditSlice";

const AboutDog = ({ dogList }) => {

    // console.log(dogList)
    const dispatch = useDispatch();

    const startEditMode = e => {
        dispatch(dogEditActions.startEdit())
        dispatch(userEditActions.startMode())
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>My Dogs
                <div className={styles.add}>
                    <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                </div>
            </div>

            {dogList.map(dog => (
                <div key={dog.id} className={styles.mainContainer}>
                <img className={styles.img} src={dog.dogProfileUrl}></img>
                    <div className={styles.wrapRight}>
                        <h3 className={styles.nickname}>{dog.dogName}</h3>
                        <span className={styles.breed}>{dog.dogBreed}</span> <br/>
                        <span className={styles.modify} onClick={startEditMode}>수정</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AboutDog;