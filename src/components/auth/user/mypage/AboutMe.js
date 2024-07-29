import React, { useEffect, useState } from 'react';
import styles from './AboutMe.module.scss';
import { useDispatch } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";

const AboutMe = ({ user }) => {

    console.log(user.nickname)
    const [nickname, setNickname] = useState(user.nickname);

    const dispatch = useDispatch();

    // 유저가 edit 진입 했던 기록을 남겨서 다시 fetch?
    const startEditMode = () => {
        dispatch(userEditActions.startMode());
        dispatch(userEditActions.startUserEditMode());
    };

    useEffect(() => {
        setNickname(user.nickname); // user 객체가 변경될 때 nickname 업데이트
        console.log(nickname)
    }, [user]);

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>Me</div>
            <div className={styles.mainContainer}>
                <img className={styles.img} src={user.profileUrl} alt="Profile" />
                <div className={styles.wrapRight}>
                    <div className={styles.flex}>
                        <h3 className={styles.nickname}>{nickname}</h3>
                        <span onClick={startEditMode} className={styles.modify}>수정</span>
                    </div>
                    <span className={styles.point}>내 포인트 : {user.point}p</span> <br />
                </div>
            </div>
        </div>
    );
};

export default AboutMe;