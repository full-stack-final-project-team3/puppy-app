import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainNavigation from "../../layout/user/MainNavigation";
import styles from "./ErrorPage.module.scss";

const ErrorPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const errorMessage = state?.status === 400
        ? "잘못된 요청입니다."
        : "요청하신 페이지를 찾을 수 없습니다.";
    const errorImage = state?.status === 400
        ? "/400Error.png"
        : "/404Error.png";

    // 400 사진 가져오기

    return (
        <>
            <MainNavigation/>
            <div className={styles.wrap}>
                <div className={styles.right}>
                    <h1>{errorMessage}</h1>
                    <button className={styles.button} onClick={() => navigate('/')}>홈으로 가기</button>
                </div>
                <div className={styles.left}>
                    <div>
                        <img className={styles.img} src={errorImage} alt="Error"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorPage;