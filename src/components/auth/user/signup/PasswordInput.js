import React, { useRef, useState } from 'react';
import styles from './PasswordInput.module.scss';

const PasswordInput = ({ onSuccess }) => {

  const passwordRef = useRef(); // 사용할 패스워드

  const [password, setPassword] = useState(''); // 패스워드 검증
  const [passwordValid, setPasswordValid] = useState(false); // 패스워드 형식 검증
  const [success, setSuccess] = useState(''); // 패스워드 검증 성공 메시지
  const [error, setError] = useState(''); // 패스워드 검증 에러 메시지
  const [passwordCheck, setPasswordCheck] = useState(''); // 패스워드 재확인
  const [checkSuccess, setCheckSuccess] = useState(''); // 패스워드 재확인 성공 메시지 
  const [checkError, setCheckError] = useState(''); // 패스워드 재확인 에러 메시지

  // 패스워드 형식 검증
  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordPattern.test(password);
  };

  // 패스워드 형식 검증
  const passwordHandler = (e) => {
    const myPassword = e.target.value;
    setPassword(myPassword);

    if (validatePassword(myPassword)) { // 형식 검증 성공
      setSuccess("사용 가능한 비밀번호입니다");
      setPasswordValid(true);
      setError(''); // 에러 메시지 초기화
    } else { // 형식 검증 에러
      setError("비밀번호는 8자 이상이며, 숫자, 문자, 특수문자를 모두 포함해야 합니다");
      onSuccess(false, false);
      setPasswordValid(false);
      setSuccess(''); // 성공 메시지 초기화
    }
  };

  // 패스워드 재확인
  const passwordCheckHandler = (e) => {
    const passwordCheck = e.target.value;
    setPasswordCheck(passwordCheck);

    if (password === passwordCheck && validatePassword(password) && password.length > 7) { // 비밀번호 재확인 성공
      setCheckSuccess("비밀번호가 일치합니다");
      setTimeout(() => {
        onSuccess(passwordCheck, true);
      }, 1500);
    } else {
      onSuccess(null, false);
      setCheckSuccess('');
      setCheckError("비밀번호가 일치하지 않습니다"); // 비밀번호 재확인 실패
    }
  };

  return (
      <div className={styles.signUpInput}>
        <h2>비밀번호</h2>
        <input
            ref={passwordRef}
            type="password"
            value={password}
            onChange={passwordHandler}
            className={styles.pwInput}
            placeholder="Enter your password"
        />
        {passwordValid && <p className={styles.successMessage}>{success}</p>}
        {!passwordValid && <p className={styles.errorMessage}>{error}</p>}

        <h2>비밀번호 확인</h2>
        <input
            type="password"
            value={passwordCheck}
            onChange={passwordCheckHandler}
            className={styles.pwCheckInput}
            placeholder="Enter your password again"
        />
        {passwordCheck && <p className={styles.successMessage}>{checkSuccess}</p>}
        {!passwordCheck && <p className={styles.errorMessage}>{checkError}</p>}
      </div>
  );
};

export default PasswordInput;
