import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from "../../layout/user/MainNavigation";
import styles from "./ErrorPage.module.scss";

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <MainNavigation/>
            <div className={styles.wrap}>
                <div className={styles.right}>
                    <h1>요청하신 페이지를 찾을 수 없습니다.</h1>
                    <button  className={styles.button} onClick={() => navigate('/')}>홈으로 가기</button>
                </div>
                <div className={styles.left}>
                    <div>
                        <img src="/404Error.png"/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorPage;