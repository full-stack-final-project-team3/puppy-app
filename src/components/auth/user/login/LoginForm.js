import React from 'react';
import { Form, Link, redirect } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import { AUTH_URL } from "../../../../config/user/host-config";
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