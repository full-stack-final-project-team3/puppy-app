import React, { useContext, useState, useEffect } from 'react';
import styles from './LoginForm.module.scss';
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../../context/user-context";
import { AUTH_URL } from "../../../../config/user/host-config";
import { RiKakaoTalkFill } from "react-icons/ri";


const APP_KEY = process.env.REACT_APP_KAKAO_APP_KEY;
const REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;
console.log(APP_KEY)

const KAKAO_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${APP_KEY}&redirect_uri=${REDIRECT_URL}&response_type=code`;

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [autoLogin, setAutoLogin] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { changeIsLogin, setUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email,
            password,
            autoLogin
        };


        try {
            const response = await fetch(`${AUTH_URL}/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // 로그인 할때 setItem

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem('userData', JSON.stringify(responseData));
                setUser(responseData);
                changeIsLogin(true); // 상태 업데이트
                navigate('/'); // 로그인 후 리디렉트할 경로
            } else {
                const errorData = await response.json();
                setError(errorData.message || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('서버와의 통신 중 오류가 발생했습니다.');
        }
    };

    // 카카오 로그인 처리
    const handleKakaoLogin = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            try {
                const response = await fetch(`${AUTH_URL}/oauth/kakao?code=${code}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const responseData = await response.json();
                    localStorage.setItem('userData', JSON.stringify(responseData));
                    setUser(responseData);
                    changeIsLogin(true); // 상태 업데이트
                    navigate('/'); // 로그인 후 리디렉트할 경로
                } else {
                    setError('카카오 로그인에 실패했습니다.');
                }
            } catch (err) {
                setError('서버와의 통신 중 오류가 발생했습니다.');
            }
        }
    };

    // useEffect 훅을 사용하여 URL에 코드가 있는지 확인
    useEffect(() => {
        handleKakaoLogin();
    }, []);

    return (
        <div className={styles.whole}>
            <div className={styles.authContainer}>
                <div>
                    <div className={styles.wrap}>
                        <img className={styles.img} src="/header-logo.png" alt="logo" />
                        <h2 className={styles.h2}>Login</h2>
                        <div className={styles.signup}>
                            <Link to="/signup" className={styles.signupBtn}>Sign Up</Link>
                        </div>
                        <div className={styles.kakao}>
                            <a href={KAKAO_LOGIN_URL} className={styles.kakaoBtn}><RiKakaoTalkFill /></a>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.loginContainer}>
                        <div className={styles.loginBox}>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="이메일을 입력하세요."
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="비밀번호를 입력하세요."
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        id="autoLogin"
                                        name="autoLogin"
                                        checked={autoLogin}
                                        onChange={(e) => setAutoLogin(e.target.checked)}
                                    />
                                    <label htmlFor="autoLogin">자동 로그인</label>
                                </div>
                                {error && <div className={styles.errorMessage}>{error}</div>}
                                <div className={styles.bottomGroup}>
                                    <div className={styles.links}>
                                        <a href="/forgot-password">아이디 / 비밀번호 찾기</a>
                                    </div>
                                    <button type="submit" className={styles.loginButton}>Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;