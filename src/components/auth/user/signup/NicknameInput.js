import React, { useRef, useState } from 'react';
import styles from './SignUpPage.module.scss';
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from 'lodash';

const NicknameInput = ({ onSuccess }) => {

  const inputRef = useRef();

  const [nicknameValid, setNicknameValid] = useState(false);

  const [nickname, setNickname] = useState("");

  
  const [success, setSuccess] = useState('');

  // 에러 메시지
  const [error, setError] = useState('');

  const checkNickname = debounce(async (nickname) => {

    // 중복 검사
    const response = await fetch(`${AUTH_URL}/check-nickname?nickname=${nickname}`);
    const flag = await response.json();

    if (flag) {
      setNicknameValid(false);
      setError('닉넴 중복');
      return;
    }

    // 닉네임 중복확인 종료
    setNicknameValid(true);
    setSuccess('닉넴 성공')
    onSuccess(nickname);
  }, 1500);

  const nicknameHandler = e => {
    const nickname = e.target.value;
    checkNickname(nickname);
  }

  return (
    <>
      <p>Step 1: 유효한 닉네임을 입력해주세요.</p>
      <input
        ref={inputRef}
        type="nickname"
        placeholder="Enter your nickname"
        onChange={nicknameHandler}
        className={!nicknameValid ? styles.invalidInput : ''}
      />
      { !nicknameValid && <p className={styles.errorMessage}>{error}</p> }
      { nicknameValid && <p className={styles.successMessage}>{success}</p> }
    </>
  )
}

export default NicknameInput