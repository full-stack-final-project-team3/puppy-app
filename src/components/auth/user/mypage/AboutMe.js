import React from 'react';
import styles from './AboutMe.module.scss';
import {useDispatch} from "react-redux";
import {userEditActions} from "../../../store/user/UserEditSlice";



const AboutMe = ({user}) => {

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
                    <div className={styles.flex}>
                        <h3 className={styles.nickname}>{user.nickname}</h3>
                        <span onClick={startEditMode} className={styles.modify}>수정</span>
                    </div>
                    <span className={styles.point}>내 포인트 : {user.point}p</span> <br/>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;