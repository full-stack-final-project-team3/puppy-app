import React from 'react';
import {BiHome, BiLeftArrow } from "react-icons/bi";
import styles from "./MyPageHeader.module.scss";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {userEditActions} from "../../../store/user/UserEditSlice";
import {dogEditActions} from "../../../store/dog/DogEditSlice";



const MyPageHeader = () => {

    const navigate = useNavigate();
    const isEditMode = useSelector(state => state.userEdit.isEditMode)
    const isUserEditMode = useSelector(state => state.userEdit.isUserEditMode)
    const isDogEditMode = useSelector(state => state.dogEdit.isDogEditMode);
    const dispatch = useDispatch();

    const goToHome = () => {
        if (isEditMode) dispatch(userEditActions.clearMode())
        if (isUserEditMode) dispatch(userEditActions.clearUserEditMode())
        if (isDogEditMode) dispatch(dogEditActions.clearEdit())
        navigate('/')
    }

    const backHandler = () => {
        const currentUrl = window.location.href;
        if (currentUrl !== `http://localhost:3000/mypage`) {
            navigate("/mypage")
        }
        if (isEditMode) dispatch(userEditActions.clearMode())
        if (isUserEditMode) dispatch(userEditActions.clearUserEditMode())
        if (isDogEditMode) dispatch(dogEditActions.clearEdit())

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