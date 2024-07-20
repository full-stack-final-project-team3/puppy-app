import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignUpPage.module.scss';
import { AUTH_URL } from '../../config/host-config';

const SignUpPage = () => {
    const navigate = useNavigate();
    const emailRef = useRef();

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [codeValid, setCodeValid] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handlePasswordCheckChange = (e) => {
        setPasswordCheck(e.target.value);
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            console.log("형식이 유효하지 않다!");
            return;
        }
        try {
            const response = await fetch(`${AUTH_URL}/check-email?email=${email}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const flag = await response.json();
            if (flag) {
                setEmailValid(false);
                return;
            }
            setEmailValid(true);
            setVerificationCodeSent(true);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleVerifyCode = async (e) => {
        console.log(verificationCode)
        e.preventDefault();
        try {
            const response = await fetch(`${AUTH_URL}/code?email=${email}&code=${verificationCode}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const flag = await response.json();
            if (flag) {
                setCodeValid(true);
                console.log("코드 검증 완료");
            } else {
                setCodeValid(false);
                console.log("코드 검증 실패");
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordCheck) {
            console.log("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!codeValid) {
            console.log("코드 검증이 완료되지 않았습니다.");
            return;
        }
        const payload = { email, password, nickname };
        try {
            const response = await fetch(`${AUTH_URL}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            navigate('/');
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className={styles.authContainer}>
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <p className={styles.inputWithButton}>
                    <label htmlFor="email">Email</label>
                    <div className={styles.emailField}>
                        <input
                            ref={emailRef}
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <button onClick={handleSendVerificationCode} disabled={verificationCodeSent}>
                            {verificationCodeSent ? '코드 발송됨' : '인증코드 받기'}
                        </button>
                    </div>
                </p>
                <p className={styles.inputWithButton}>
                    <label htmlFor="verificationCode">Verification Code</label>
                    <div className={styles.emailField}>
                        <input
                            id="verificationCode"
                            type="text"
                            name="verificationCode"
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            required
                        />
                        <button onClick={handleVerifyCode} disabled={codeValid}>
                            {codeValid ? '완료' : '코드 검증'}
                        </button>
                    </div>
                </p>
                <p>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </p>
                <p>
                    <label htmlFor="passwordCheck">Confirm Password</label>
                    <input
                        id="passwordCheck"
                        type="password"
                        name="passwordCheck"
                        value={passwordCheck}
                        onChange={handlePasswordCheckChange}
                        required
                    />
                </p>
                <p>
                    <label htmlFor="nickname">Nickname</label>
                    <input
                        id="nickname"
                        type="text"
                        name="nickname"
                        value={nickname}
                        onChange={handleNicknameChange}
                        required
                    />
                </p>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
                <div className={styles.loginLink}>
                    <Link to="/login">이미 계정이 있으신가요? 로그인</Link>
                </div>
            </form>
        </div>
    );
};

export default SignUpPage;