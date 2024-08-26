import React, { useContext, useState } from "react";
import styles from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../../context/user-context";
import { AUTH_URL, NOTICE_URL } from "../../../../config/user/host-config";
import { RiKakaoTalkFill } from "react-icons/ri";
import { userEditActions } from "../../../store/user/UserEditSlice";
import { useDispatch } from "react-redux";
import Footer from "../../../../layout/user/Footer";
import { Cookies, useCookies } from "react-cookie";
import { PulseLoader } from "react-spinners"; // 스피너 임포트

const APP_KEY = process.env.REACT_APP_KAKAO_APP_KEY;
const REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URL;

const KAKAO_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${APP_KEY}&redirect_uri=${REDIRECT_URL}&response_type=code`;

const LoginForm = () => {
    const [cookies, setCookie] = useCookies(['authToken']);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [autoLogin, setAutoLogin] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const navigate = useNavigate();
    const { changeIsLogin, setUser } = useContext(UserContext);
    const dispatch = useDispatch();
    const authToken = cookies.authToken;

    const provider = localStorage.getItem('provider'); // 로컬 스토리지에서 provider 값 가져오기

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { email, password, autoLogin };

        try {
            const response = await fetch(`${AUTH_URL}/sign-in`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: 'include',
            });
            if (response.ok) {
                const responseDataCookie = await response.json();

                if (payload.autoLogin) {
                    const token = responseDataCookie.token;
                    setCookie('authToken', token, {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 30 // 30일
                    });
                    dispatch(userEditActions.setUserCookie(token));
                    localStorage.setItem("userData", JSON.stringify(responseDataCookie));
                } else {
                    sessionStorage.setItem("userData", JSON.stringify(responseDataCookie));
                }

                const userDetailData = await (await fetch(`${AUTH_URL}/${email}`)).json();
                const noticeData = await (await fetch(`${NOTICE_URL}/user/${userDetailData.id}`)).json();

                dispatch(userEditActions.saveUserNotice(noticeData));
                dispatch(userEditActions.updateUserDetail(userDetailData));

                // const responseData = await response.json();
                setUser(responseDataCookie);
                changeIsLogin(true);
                localStorage.removeItem('provider'); // 로그인 시 provider 정보 제거
                navigate("/");
            } else {
                const errorText = await response.text();
                setError(errorText || "로그인에 실패했습니다.");
            }
        } catch (err) {
            console.log("Unexpected error:", err);
        }
    };

    const enterHandler = (e) => {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    };

    const getKakaoUserInfo = async () => {
        setLoading(true); // 스피너 시작

        const setProviderInLocalStorage = () => {
            setTimeout(() => {
                localStorage.setItem('provider', 'kakao')
            }, 3000)
        }
        setProviderInLocalStorage()

        if (authToken) {
            const firstResponse = await fetch(`${AUTH_URL}/auto-login`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (firstResponse.ok) {
                const data = await firstResponse.json();

                const response = await fetch(`${AUTH_URL}/sign-in`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                        autoLogin: data.autoLogin,
                    }),
                });

                const userDetailData = await (await fetch(`${AUTH_URL}/${data.email}`)).json();
                const noticeData = await (await fetch(`${NOTICE_URL}/user/${data.id}`)).json();

                localStorage.setItem("userData", JSON.stringify(response));
                dispatch(userEditActions.saveUserNotice(noticeData));
                dispatch(userEditActions.updateUserDetail(userDetailData));
            }
        }

        // 카카오 로그인 페이지로 리다이렉트
        window.location.href = KAKAO_LOGIN_URL;
    };

    return (
        <>
            <div className={styles.whole} onKeyDown={enterHandler}>
                <div className={styles.authContainer}>
                    <div>
                        <div className={styles.wrap}>
                            <img className={styles.img} src="/header-logo.png" alt="logo" />
                            <h2 className={styles.h2}>Login</h2>
                            <div className={styles.signup}>
                                <Link to="/signup" className={styles.signupBtn}>
                                    Sign Up
                                </Link>
                            </div>
                            <div className={styles.kakao}>
                                <a href={KAKAO_LOGIN_URL} className={styles.kakaoBtn} onClick={getKakaoUserInfo}>
                                    <RiKakaoTalkFill />
                                </a>
                            </div>
                            {provider === 'kakao' && (
                                <div className={styles.kakaoRecentLogin}>
                                    최근 사용한 서비스
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className={styles.loginContainer}>
                            <div className={styles.loginBox}>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label} htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="이메일을 입력하세요."
                                            className={styles.input}
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label htmlFor="password" className={styles.label}>
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            placeholder="비밀번호를 입력하세요."
                                            className={styles.input}
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
                                            className={styles.input}
                                            checked={autoLogin}
                                            onChange={(e) => setAutoLogin(e.target.checked)}
                                        />
                                        <label htmlFor="autoLogin" className={styles.label}>
                                            자동 로그인
                                        </label>
                                    </div>
                                    {error && (
                                        <div className={styles.errorMessage}>{error}</div>
                                    )}
                                    <div className={styles.bottomGroup}>
                                        <div className={styles.links}>
                                            <Link to={"/forgot-info"}>아이디 / 비밀번호 찾기</Link>
                                        </div>
                                        <button type="submit" className={styles.loginButton}>
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && ( // loading이 true일 때 스피너 오버레이 표시
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinnerContainer}>
                        <PulseLoader color="#333" loading={loading} size={15} />
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default LoginForm;
