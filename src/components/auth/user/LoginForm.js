import React from 'react';
import styles from './LoginForm.module.scss';
import LoginFormLeft from "./LoginFormLeft";
import LoginFormRight from "./LoginFormRight";

const LoginForm = () => {
    return (
        <div className={styles.authContainer}>
            <div>
                <LoginFormLeft />
            </div>
            <div>
                <LoginFormRight />
            </div>
        </div>
    );
};

export default LoginForm;
