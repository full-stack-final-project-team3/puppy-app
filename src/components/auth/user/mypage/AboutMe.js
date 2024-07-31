import React, { useEffect } from 'react';
import styles from './AboutMe.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import { AUTH_URL } from "../../../../config/user/host-config";

const AboutMe = () => {
    const user = useSelector(state => state.userEdit.userDetail);
    const dispatch = useDispatch();

    useEffect(() => {
        // 로컬 저장소에서 상태를 복원
        const storedUserDetail = localStorage.getItem('userDetail');
        if (storedUserDetail) {
            dispatch(userEditActions.updateUserDetail(JSON.parse(storedUserDetail)));
        } else {
            // 로컬 저장소에 데이터가 없을 경우 API를 호출하여 사용자 정보를 가져옴
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`${AUTH_URL}/user`);
                    const userData = await response.json();
                    dispatch(userEditActions.updateUserDetail(userData));
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };
            fetchUserData();
        }
    }, [dispatch]);

    console.log(user);

    const startEditMode = () => {
        dispatch(userEditActions.startMode());
        dispatch(userEditActions.startUserEditMode());
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>Me</div>
            <div className={styles.mainContainer}>
                <img className={styles.img} src={user.profileUrl} alt="Profile" />
                <div className={styles.wrapRight}>
                    <div className={styles.flex}>
                        <h3 className={styles.nickname}>{user.nickname}</h3>
                        <span onClick={startEditMode} className={styles.modify}>수정</span>
                    </div>
                    <span className={styles.point}>내 포인트 : {user.point}p</span> <br />
                </div>
            </div>
        </div>
    );
};

export default AboutMe;