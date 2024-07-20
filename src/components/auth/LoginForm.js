import React from 'react';
import { Form, Link, redirect } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import { AUTH_URL } from "../../config/host-config";

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

export const loginAction = async ({ request }) => {
    const formData = await request.formData();

    const payload = {
        email: formData.get('email'),
        password: formData.get('password'),
        autoLogin: formData.get('isAutoLogin') === 'on',
    };

    const response = await fetch(`${AUTH_URL}/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    //
    // if (response.status === 422) {
    //     const errorText = await response.text();
    //     return errorText;
    // }

    const responseData = await response.json();
    localStorage.setItem('userData', JSON.stringify(responseData));
    console.log(responseData);

    return redirect('/');
};