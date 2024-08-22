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
    return emailPattern.test(email) && email.slice(-3) === 'com';
  };

  // 이메일 검증 처리
  const checkEmail = debounce(async (email) => {
    if (!validateEmail(email)) {
      setError("유효하지 않은 이메일입니다");
      return;
    } else {
      setSuccess("사용가능한 이메일입니다");
    }

    // 중복 검사
    const response = await fetch(`${AUTH_URL}/check-email?email=${email}`);
    const flag = await response.json();

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
    checkEmail(email); // 이메일 검증 후속 처리
  };


  // Enter 키 눌렀을 때 debounce 취소하고 바로 서버 요청
  const checkEmailWithoutDebounce = async (e) => {
    const email = e.target.value;  // 입력 필드에서 email 값을 가져옴

    if (e.key === "Enter") {
      if (!validateEmail(email)) {
        setError("유효하지 않은 이메일입니다");
        return;
      } else {
        setSuccess("사용가능한 이메일입니다");
      }

      // 중복 검사
      const response = await fetch(`${AUTH_URL}/check-email?email=${email}`);
      const flag = await response.json();

      if (flag) {
        setEmailValid(false);
        setError("이메일이 중복되었습니다");
        return;
      } else {
        setEmailValid(true);
        setSuccess("사용가능한 이메일입니다");
      }

      onSuccess(email);
    }
  }

  // 렌더링 되자마자 입력창에 포커싱
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
      <>
        <h1 className={styles.h1}>Email</h1>
        <div className={styles.signUpInput}>
          <h2 className={styles.h2}>이메일</h2>
          <input
              ref={inputRef}
              type="email"
              placeholder="ex) abc123@naver.com"
              onChange={changeHandler}
              onKeyDown={checkEmailWithoutDebounce}
              className={styles.input}
          />
          {emailValid && <p className={styles.successMessage}>{success}</p>}
          {!emailValid && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </>
  );
};

export default EmailInput;