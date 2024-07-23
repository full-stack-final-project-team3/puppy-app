import React, {useEffect, useRef, useState} from 'react';
import styles from "./SignUpPage.module.scss";

const PasswordInput = ({ onSuccess }) => {

  const passwordRef = useRef();

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const changeHandler =(e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (validatePassword(newPassword)) {
      setPasswordValid(true);
      setErrorMessage('');
      onSuccess(newPassword, true);
    } else {
      setPasswordValid(false);
      setErrorMessage('비밀번호는 8자 이상이며, 숫자, 문자, 특수문자를 모두 포함해야 합니다.');
      onSuccess(newPassword, false);
    }
  };


  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  return (
    <>
      <h1>Step 3</h1>
      <h2>비밀번호 입력</h2>
      <input
        ref={passwordRef}
        type="password"
        value={password}
        onChange={changeHandler}
        className={passwordValid ? '' : styles.invalidInput}
        placeholder="Enter your password"
      />
      {/* <h2>비밀번호 확인</h2>
      <input
        ref={passwordRef}
        type="passwordCheck"
        value={passwordCheck}
        onChange={changeHandler}
        className={passwordValid ? '' : styles.invalidInput}
        placeholder="Enter your password again"
      /> */}
      {!passwordValid && <p className={styles.errorMessage}>{errorMessage}</p>}
      
    </>
  );
};

export default PasswordInput;