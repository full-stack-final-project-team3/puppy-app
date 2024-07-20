import React from 'react';
import { Form, Link } from 'react-router-dom';
import styles from './SignUpPage.module.scss';

const SignUpPage = () => {
    return (
        <div className={styles.authContainer}>
            <Form method="post">
                <h1>Sign Up</h1>
                <p>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" required />
                </p>
                <p>
                    <label htmlFor="verificationCode">Verification Code</label>
                    <input id="verificationCode" type="text" name="verificationCode" required />
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" required />
                </p>
                <p>
                    <label htmlFor="passwordCheck">Confirm Password</label>
                    <input id="passwordCheck" type="password" name="passwordCheck" required />
                </p>
                <p>
                    <label htmlFor="nickname">Nickname</label>
                    <input id="nickname" type="text" name="nickname" required />
                </p>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
                <div className={styles.loginLink}>
                    <Link to="/login">이미 계정이 있으신가요? 로그인</Link>
                </div>
            </Form>
        </div>
    );
};

export default SignUpPage;