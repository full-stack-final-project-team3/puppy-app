import React, { useContext, useState } from 'react';
import styles from './LoginForm.module.scss';
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../../context/user-context";
import { AUTH_URL } from "../../../../config/user/host-config";
import { RiKakaoTalkFill } from "react-icons/ri";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [autoLogin, setAutoLogin] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { changeIsLogin,  setUser } = useContext(UserContext);

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
                            <Link to="/signup" className={styles.kakaoBtn}><RiKakaoTalkFill /></Link>
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