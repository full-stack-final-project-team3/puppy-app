import React, { useEffect, useRef, useState } from "react";
import styles from "./SignUpPage.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from "lodash";

const EmailInput = ({ onSuccess }) => {
  const inputRef = useRef();

  const [emailValid, setEmailValid] = useState(false); // 검증 여부
  const [success, setSuccess] = useState(""); // 검증 성공 메시지
  const [error, setError] = useState(""); // 검증 에러 메시지

  // 이메일 패턴 검증
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 패턴 검사
    return emailPattern.test(email);
  };

  // 이메일 검증 후속 처리
  const checkEmail = debounce(async (email) => {
    if (!validateEmail(email)) {
      // 에러메시지 세팅
      setError("이메일 형식이 유효하지 않습니다");
      return;
    } else {
      setSuccess("사용가능한 이메일입니다");
    }

    // 중복 검사
    const response = await fetch(`${AUTH_URL}/check-email?email=${email}`);
    // console.log('response: ', response);
    const flag = await response.json();
    // console.log('flag: ', flag);
    if (flag) {
      setEmailValid(false);
      setError("이메일이 중복되었습니다");
      return;
    } else {
      setEmailValid(true);
      setSuccess("사용가능한 이메일입니다");
    }

    // 이메일 중복확인 끝
    setEmailValid(true);
    onSuccess(email);
  }, 1500);

  const changeHandler = (e) => {
    const email = e.target.value;

    checkEmail(email); // 이메일 검증 후속처리
  };

  // 렌더링 되자마자 입력창에 포커싱
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <h1 className={styles.h1}>Step 1</h1>
      <div className={styles.emailInput}>
        <h2 className={styles.h2}>이메일</h2>
        <input
          ref={inputRef}
          type="email"
          placeholder="Enter your email"
          onChange={changeHandler}
          className={styles.input}
        />
        {emailValid && <p className={styles.successMessage}>{success}</p>}
        {!emailValid && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </>
  );
};

export default EmailInput;
