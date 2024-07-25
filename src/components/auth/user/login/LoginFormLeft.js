import React from 'react';
import {Link} from "react-router-dom";
import styles from './LoginForm.module.scss';
import {RiKakaoTalkFill} from "react-icons/ri";

const LoginFormLeft = () => {
    return (
        <>
            <div className={styles.wrap}>
                <img src="/header-logo.png" alt="logo"/>
                <h2>Login</h2>
                <div className={styles.signup}>
                    <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
                </div>
                <div className={styles.kakao}>
                    <Link to="/signup" className={styles.kakaoBtn}><RiKakaoTalkFill/></Link>
                </div>
            </div>
        </>
    );
};

export default LoginFormLeft;