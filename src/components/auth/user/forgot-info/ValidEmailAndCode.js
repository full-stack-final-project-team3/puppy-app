import React, { useRef, useState } from 'react';
import styles from './ValidEmailAndCode.module.scss';
import { debounce } from "lodash";
import { AUTH_URL } from "../../../../config/user/host-config";

const ValidEmailAndCode = ({ isClear, getEmail }) => {
    const [emailValid, setEmailValid] = useState(false);
    const [error, setError] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const emailRef = useRef();
    const verifiCodeRef = useRef([]);
    const [codes, setCodes] = useState(Array(4).fill(''));
    const [email, setEmail] = useState('');

    const changeHandler = e => {
        const email = e.target.value;
        checkEmail(email);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const onSuccess = (email) => {
        setError('');
        setEmailValid(true);
        setVerificationCodeSent(true);
        getEmail(emailRef.current.value);
        console.log("getMail valid에서 발동, ", email)
    };

    const checkEmail = debounce(async (email) => {
        if (!validateEmail(email)) {
            setError('이메일 형식이 유효하지 않습니다.');
            setEmailValid(false);
            setVerificationCodeSent(false);
            return;
        }

        const response = await fetch(`${AUTH_URL}/forgot-email?email=${email}`);
        const result = await response.text();

        if (response.ok) {
            setEmail(email);
            setEmailValid(true);
            onSuccess(email);
        } else {
            setEmailValid(false);
            setVerificationCodeSent(false);
            setError(result || '이메일이 중복되었습니다.');
        }
    }, 1000);

    const verificationCodeChangeHandler = e => {
        setVerificationCode(e.target.value);
    };

    const focusNextInput = (index) => {
        if (index < verifiCodeRef.current.length) {
            verifiCodeRef.current[index].focus();
        }
    };

    const verifyCode = debounce(async (code) => {
        console.log('요청 전송: ', code);

        const response = await fetch(`${AUTH_URL}/forgot-code?email=${email}&code=${code}`);
        const flag = await response.json();

        console.log('코드검증: ', flag);
        if (!flag) {
            setError('유효하지 않거나 만료된 코드입니다. 인증코드를 재발송합니다.');
            setCodes(Array(4).fill(''));
            return;
        }

        onSuccess();
        console.log("검증 성공");
        setError('');
        isClear(true);
    }, 1500);

    const changeCodeHandler = (index, inputValue) => {
        const updatedCodes = [...codes];
        updatedCodes[index - 1] = inputValue;

        setCodes(updatedCodes);

        focusNextInput(index);

        if (updatedCodes.length === 4 && index === 4) {
            const code = updatedCodes.join('');
            verifyCode(code);
        }
    };

    return (
        <div className={styles.authContainer}>
            <h3>가입할때 사용하신 이메일을 입력해주세요.</h3>
            <input
                ref={emailRef}
                className={styles.input}
                type="email"
                placeholder="Enter your email"
                onChange={changeHandler}
            />
            {!emailValid && <p className={styles.errorMessage}>{error}</p>}

            {verificationCodeSent && (
                <div className={styles.codeInputContainer}>
                    <h3 className={styles.h3}>인증 코드를 입력해주세요.</h3>
                    <div className={styles.codeInputWrapper}>
                        {Array.from(new Array(4)).map((_, index) => (
                            <input
                                ref={($input) => verifiCodeRef.current[index] = $input}
                                key={index}
                                type="text"
                                className={styles.codeInput}
                                maxLength={1}
                                onChange={(e) => changeCodeHandler(index + 1, e.target.value)}
                                value={codes[index]}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValidEmailAndCode;