import React from 'react';
import styles from './AboutMe.module.scss';
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userEditActions} from "../../../store/user/UserEditSlice";
import userEdit from "./UserEdit";


const AboutMe = ({ user }) => {

    const dispatch = useDispatch();
    const startEditMode = e => {
        dispatch(userEditActions.startMode())
        dispatch(userEditActions.startUserEditMode())
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>Me</div>
            <div className={styles.mainContainer}>
                <img className={styles.img} src={user.profileUrl}></img>
                <div className={styles.wrapRight}>
                    <h3 className={styles.nickname}>{user.nickname}</h3>
                    <span className={styles.point}>내 포인트 : {user.point}</span> <br/>
                    <span onClick={startEditMode} className={styles.modify}>수정</span>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;