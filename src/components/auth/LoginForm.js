// src/components/auth/LoginForm.js
import React from 'react';
import { Form, Link } from 'react-router-dom';
import styles from './LoginForm.module.scss';

const LoginForm = () => {
    return (
        <div className={styles.authContainer}>
            <Form method="post">
                <h1>Log in</h1>
                <p>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" required />
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" required />
                </p>
                <div className={styles.checkboxContainer}>
                    <input type="checkbox" id="autoLogin" name="isAutoLogin" />
                    <label htmlFor="autoLogin">자동 로그인</label>
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                <div className={styles.signupLink}>
                    <Link to="/signup">회원가입</Link>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;