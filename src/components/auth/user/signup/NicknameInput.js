import React, { useEffect, useRef, useState } from "react";
import styles from "./SignUpPage.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from "lodash";

const NicknameInput = ({ onSuccess }) => {
  const inputRef = useRef();

  const [nicknameValid, setNicknameValid] = useState(false); // 닉네임 검증
  const [success, setSuccess] = useState(""); // 중복 검증 성공 메시지
  const [error, setError] = useState(""); // 중복 검증 에러 메시지
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const checkNickname = debounce(async (nickname) => {
    // 중복 검사
    const response = await fetch(
      `${AUTH_URL}/check-nickname?nickname=${nickname}`
    );
    const flag = await response.json();

    if (flag) {
      setNicknameValid(false);
      setError("닉네임이 중복되었습니다");
      return;
    }

    // 닉네임 중복확인 종료
    setNicknameValid(true);
    setSuccess("사용가능한 닉네임입니다");
    onSuccess(nickname);
  }, 1500);

  const nicknameHandler = debounce((e) => {
    const nickname = e.target.value;
    checkNickname(nickname);
    nextStep();
  }, 1000);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <h1 className={styles.h1}>Step 2</h1>
      <div className={styles.signUpInput}>
        <h2>닉네임</h2>
        <input
          ref={inputRef}
          type="nickname"
          placeholder="Enter your nickname"
          onChange={nicknameHandler}
          className={styles.input}
        />
        {nicknameValid && <p className={styles.successMessage}>{success}</p>}
        {!nicknameValid && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </>
  );
};

export default NicknameInput;
