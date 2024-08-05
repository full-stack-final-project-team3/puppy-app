import React, { useRef, useState } from 'react';
import styles from "./SignUpPage.module.scss";
import { AUTH_URL } from "../../../../config/user/host-config";
import { debounce } from 'lodash';

const PhoneNumberInput = ({ onSuccess }) => {
  const inputRef = useRef();

  const [phoneNumberValid, setPhoneNumberValid] = useState(false); // 검증 여부
  const [success, setSuccess] = useState(''); // 검증 성공 메시지
  const [error, setError] = useState(''); // 검증 에러 메시지

   // 휴대폰 번호 패턴 검증
  const validateNumber = (phoneNumber) => {
    const numberPattern = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
    return numberPattern.test(phoneNumber);
  };

  // 휴대폰 번호 검증 처리
  const checkNumber = debounce(async (phoneNumber) => {
    if (!validateNumber(phoneNumber)) {
      setError('유효하지 않은 번호입니다');
      return;
    } else {
      setSuccess('사용가능한 번호입니다');
    }

    // 중복 검사
    const response = await fetch(`${AUTH_URL}/check-phoneNumber?phoneNumber=${phoneNumber}`);
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
    onSuccess(phoneNumber);
  }, 1500);

  const numberInputHandler = (e) => {
    const phoneNumber = e.target.value;
    checkNumber(phoneNumber); // 휴대폰 번호 검증 후속 처리
  };

  return (
    <>
      <div className={styles.signUpInput}>
        <h2 className={styles.h2}>휴대폰 번호</h2>
        <input
          ref={inputRef}
          type='text'
          onChange={numberInputHandler}
          className={styles.input}
          placeholder='ex) 01012345678'
        />
        {phoneNumberValid && <p className={styles.successMessage}>{success}</p>}
        {!phoneNumberValid && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </>
  );
};

export default PhoneNumberInput;
