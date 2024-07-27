import React from 'react';
import {BiHome, BiLeftArrow } from "react-icons/bi";
import styles from "./MyPageHeader.module.scss";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userEditActions} from "../../../store/user/UserEditSlice";


const MyPageHeader = () => {

    const navigate = useNavigate();
    const isEditMode = useSelector(state => state.userEdit.isEditMode)
    const dispatch = useDispatch();

    const goToHome = () => {
        navigate('/')
    }

    const backHandler = () => {
        if (isEditMode) dispatch(userEditActions.clearMode())
    }


    return (
        <header className={styles.headerWrap}>
            <BiLeftArrow onClick={backHandler} className={styles.icon}/>
            <h3>MY PAGE</h3>
            <BiHome className={styles.icon} onClick={goToHome}/>
        </header>
    );
};

export default MyPageHeader;