import React from 'react';
import styles from './DogEdit.module.scss';
import {useDispatch} from "react-redux";
import {userEditActions} from "../../store/user/UserEditSlice";
import {dogEditActions} from "../../store/dog/DogEditSlice";

const DogEdit = () => {

    const dispatch = useDispatch();
    const clearEditMode = e => {
        dispatch(userEditActions.clearMode())
        dispatch(dogEditActions.clearEdit())
    }

    return (
        <div>
            강아지 수정 !!!
            <button onClick={clearEditMode}>완료</button>
        </div>
    );
};

export default DogEdit;