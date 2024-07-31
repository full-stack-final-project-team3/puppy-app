import React, { useEffect, useRef, useState } from 'react';
import styles from "./SignUpPage.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from 'lodash';

const PhoneNumberInput = ({ onSuccess }) => {
  const inputRef = useRef();

  const [phoneNumberValid, setPhoneNumberValid] = useState(false); // 검증 여부
  const [success, setSuccess] = useState(''); // 검증 성공 메시지
  const [error, setError] = useState(''); // 검증 에러 메시지

  const validateNumber = (number) => {
    const numberPattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/ // 휴대폰 번호 패턴 검사
    return numberPattern.test(number);
  };

  // 휴대폰 번호 검증 처리
  const checkNumber = debounce(async (number) => {
    if (!validateNumber(number)) {
      setError('유효하지 않은 번호입니다');
      return;
    } else {
      setSuccess('사용가능한 번호입니다');
    }

    // 중복 검사
    const response = await fetch(`${AUTH_URL}/check-phoneNumber?phoneNumber=${number}`);
    const flag = await response.json();

    if (flag) {
      setPhoneNumberValid(false);
      setError('이미 등록되어있는 번호입니다');
      return;
    } else {
      setPhoneNumberValid(true);
      setSuccess('사용 가능한 번호입니다');
    }

    // 휴대폰 번호 중복확인 끝
    setPhoneNumberValid(true);
    onSuccess(number);
  }, 1500);

  const numberInputHandler = (e) => {
    const number = e.target.value;
    checkNumber(number); // 휴대폰 번호 검증 후속 처리
  };

  // 렌더링 되자마자 입력창에 포커싱
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <div className={styles.signupInput}>
        <h2 className={styles.h2}>휴대폰 번호</h2>
        <input 
          ref={inputRef}
          type='number'
          onChange={numberInputHandler}
          className={styles.input}
          placeholder='ex) 010-1234-5678'
        />
        {phoneNumberValid && <p className={styles.successMessage}>{success}</p>}
        {!phoneNumberValid && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </>
  );
};

export default PhoneNumberInput;
