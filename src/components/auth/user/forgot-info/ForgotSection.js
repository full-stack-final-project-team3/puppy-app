import React, { useRef, useState } from 'react';
import styles from './ForgotSection.module.scss';
import { debounce } from "lodash";
import { AUTH_URL } from "../../../../config/user/host-config";

const ForgotSection = () => {

    // 검증여부
    const [emailValid, setEmailValid] = useState(false);

    // 에러 메시지
    const [error, setError] = useState('');

    const emailRef = useRef();

    const changeHandler = e => {
        const email = e.target.value;
        checkEmail(email); // 이메일 검증 호출
    };

    // 이메일 유효성 검사 함수
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // 이메일 검증 후 성공 처리 함수
    const onSuccess = (email) => {
        setError('');
        setEmailValid(true);
        console.log('Valid email:', email);
    };

    // 이메일 검증 후속 처리
    const checkEmail = debounce(async (email) => {
        if (!validateEmail(email)) {
            // 에러메시지 세팅
            setError('이메일 형식이 유효하지 않습니다.');
            setEmailValid(false);
            return;
        }

        // 중복 검사
        const response = await fetch(`${AUTH_URL}/forgot-email?email=${email}`);
        const flag = await response.json();
        if (flag) {
            setEmailValid(false);
            setError('이메일이 중복되었습니다.');
            return;
        }

        // 이메일 중복확인 끝
        setEmailValid(true);
        onSuccess(email);
    }, 1500);

    return (
        <div className={styles.whole}>
            <div className={styles.authContainer}>
                <h3>가입할때 사용하신 이메일을 입력해주세요.</h3>
                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Enter your email"
                    onChange={changeHandler}
                    // className={!emailValid ? styles.invalidInput : ''}
                />
                { !emailValid && <p className={styles.errorMessage}>{error}</p> }
            </div>
        </div>
    );
};

export default ForgotSection;