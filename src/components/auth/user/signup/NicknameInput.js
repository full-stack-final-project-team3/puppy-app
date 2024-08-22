import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./SignUpPage.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from "lodash";

const NicknameInput = ({ onSuccess }) => {
  const inputRef = useRef();

  const [nicknameValid, setNicknameValid] = useState(false); // 닉네임 검증
  const [success, setSuccess] = useState(""); // 중복 검증 성공 메시지
  const [error, setError] = useState(""); // 중복 검증 에러 메시지

  const checkNickname = debounce(async (nickname) => {
    if (nickname.trim() === "") {
      setNicknameValid(false);
      setError("닉네임이 비어있습니다");
      setSuccess("");
      onSuccess(null); // 닉네임이 비어있음을 알림
      return;
    }

    // 중복 검사
    const response = await fetch(
        `${AUTH_URL}/check-nickname?nickname=${nickname}`
    );
    const flag = await response.json();

    if (flag) {
      setNicknameValid(false);
      setError("닉네임이 중복되었습니다");
      setSuccess("");
      onSuccess(null); // 중복된 닉네임을 알림
      return;
    }

    // 닉네임 중복확인 종료
    setNicknameValid(true);
    setSuccess("사용가능한 닉네임입니다");
    setError("");
    onSuccess(nickname);
  }, 1000);

  const nicknameHandler = (e) => {
    const nickname = e.target.value;
    checkNickname(nickname);
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
      <>
        <h1 className={styles.h1}>Nickname / Password</h1>
        <div className={styles.signUpInput}>
          <h2>닉네임</h2>
          <input
              ref={inputRef}
              type="text"
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