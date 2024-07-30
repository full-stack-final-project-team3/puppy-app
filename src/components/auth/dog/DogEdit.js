import React from 'react';
import styles from './DogEdit.module.scss';
import {useDispatch} from "react-redux";
import {userEditActions} from "../../store/user/UserEditSlice";
import {dogEditActions} from "../../store/dog/DogEditSlice";

const DogEdit = ({ user }) => {


    console.log(user.dogList)
    const dispatch = useDispatch();
    const clearEditMode = e => {
        dispatch(userEditActions.clearMode())
        dispatch(dogEditActions.clearEdit())
    }




    return (
        <div>
            <div className={styles.wrap}>
                <img className={styles.img} src="/header-logo.png" alt="Header Logo"/>
                <h2 className={styles.title}>강아지 정보 수정</h2>
                <div>

                </div>
                <button onClick={clearEditMode}>완료</button>
            </div>
        </div>
    );
};

export default DogEdit;