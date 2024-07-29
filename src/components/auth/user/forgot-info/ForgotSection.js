import React, { useRef, useState } from 'react';
import styles from './ForgotSection.module.scss';
import { debounce } from "lodash";
import { AUTH_URL } from "../../../../config/user/host-config";

const ForgotSection = () => {
    const [emailValid, setEmailValid] = useState(false);
    const [error, setError] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false); // 인증 코드 발송 여부
    const [verificationCode, setVerificationCode] = useState(''); // 인증 코드 상태
    const emailRef = useRef();
    const verifiCodeRef = useRef([]);
    const [codes, setCodes] = useState(Array(4).fill(''));
    const [email, setEmail] = useState(''); // 이메일 상태 추가

    const changeHandler = e => {
        const email = e.target.value;
        checkEmail(email); // 이메일 검증 호출
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const onSuccess = (email) => {
        setError('');
        setEmailValid(true);
        setVerificationCodeSent(true); // 인증 코드 발송 상태로 변경
        console.log('Valid email:', email);
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
            setEmail(email); // 이메일 상태 저장
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

    // 다음 칸으로 포커스를 이동하는 함수
    const focusNextInput = (index) => {
        if (index < verifiCodeRef.current.length) {
            verifiCodeRef.current[index].focus();
        }
    };

    // 서버에 검증요청 보내기
    const verifyCode = debounce(async (code) => {
        console.log('요청 전송: ', code);

        const response = await fetch(`${AUTH_URL}/forgot-code?email=${email}&code=${code}`);
        const flag = await response.json();

        console.log('코드검증: ', flag);
        // 검증에 실패했을 때
        if (!flag) {
            setError('유효하지 않거나 만료된 코드입니다. 인증코드를 재발송합니다.');
            // 기존 인증코드 상태값 비우기
            setCodes(Array(4).fill(''));
            return;
        }

        // 검증 성공 시
        onSuccess();
        console.log("검증 성공")
        setError('');
    }, 1500);

    const changeCodeHandler = (index, inputValue) => {
        const updatedCodes = [...codes];
        updatedCodes[index - 1] = inputValue;
        console.log(updatedCodes);

        // codes변수에 입력한 숫자 담아놓기
        setCodes(updatedCodes);

        // 입력이 끝나면 다음 칸으로 포커스 이동
        focusNextInput(index);

        // 입력한 숫자 합치기
        if (updatedCodes.length === 4 && index === 4) {
            const code = updatedCodes.join('');
            // 서버로 인증코드 검증 요청 전송
            verifyCode(code);
        }
    };

    return (
        <div className={styles.whole}>
            <div className={styles.authContainer}>
                <h3>가입할때 사용하신 이메일을 입력해주세요.</h3>
                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Enter your email"
                    onChange={changeHandler}
                />
                { !emailValid && <p className={styles.errorMessage}>{error}</p> }

                { verificationCodeSent && (
                    <div className={styles.codeInputContainer}>
                        <h3>인증 코드를 입력해주세요.</h3>
                        <div>
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
        </div>
    );
};

export default ForgotSection;