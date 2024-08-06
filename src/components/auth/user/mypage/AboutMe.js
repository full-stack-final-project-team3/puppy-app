import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AboutMe.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { userEditActions } from "../../../store/user/UserEditSlice";
import { AUTH_URL } from "../../../../config/user/host-config";

const AboutMe = () => {
    const user = useSelector(state => state.userEdit.userDetail);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                    // if (response.status === 400) {
                    //     navigate('/error', { state: { status: 400 } }); // 에러 페이지로 리다이렉트
                    // } else if (response.status === 404) {
                    //     navigate('/error', { state: { status: 404 } }); // 404 에러 처리
                    // } else if (response.ok) {
                     if (!response.ok) {
                        console.error('Failed to fetch user data:', response.status);
                    } else {
                        const userData = await response.json();
                        dispatch(userEditActions.updateUserDetail(userData));
                     }
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            };
            fetchUserData();
        }
    }, [dispatch, navigate]);

    const startEditMode = () => {
        dispatch(userEditActions.startMode());
        dispatch(userEditActions.startUserEditMode());
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>Me</div>
            <div className={styles.mainContainer}>
                <div className={styles.img}>
                    <img className={styles.image} src={user.profileUrl} alt="Profile" />
                </div>
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