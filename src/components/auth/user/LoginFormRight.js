import React from 'react';
import styles from './LoginFormRight.module.scss';

const LoginFormRight = () => {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <form>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="이메일을 입력하세요." required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요." required />
                    </div>
                    <div className={styles.bottomGroup}>
                        <div className={styles.links}>
                            <a href="/forgot-password">아이디 / 비밀번호 찾기</a>
                        </div>
                        <button type="submit" className={styles.loginButton}>Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginFormRight;