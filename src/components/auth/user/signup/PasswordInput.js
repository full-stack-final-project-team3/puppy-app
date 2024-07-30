import React, {useEffect, useRef, useState} from 'react';
import styles from './SignUpPage.module.scss';

const PasswordInput = ({ onSuccess }) => {

  const passwordRef = useRef();
  const passwordCheckRef = useRef();

  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState('');

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const changeHandler = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    console.log(newPassword)

    if (validatePassword(newPassword)) {
      setPasswordValid(true);
      setErrorMessage('');
      // onSuccess(newPassword, true);
    } else {
      setPasswordValid(false);
      setErrorMessage('비밀번호는 8자 이상이며, 숫자, 문자, 특수문자를 모두 포함해야 합니다.');
      onSuccess(newPassword, false);
    }
  };

  const checkHandler = e => {
    const checkPassword = e.target.value;
    setPasswordCheck(checkPassword);
    console.log(checkPassword)

    if (password === checkPassword) {
      setSuccess("비번 일치")
      onSuccess(checkPassword, true);
      setPasswordValid(true);
    } else {
      setErrorMessage("비번틀림");
    }


  }


  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  return (
      <>
        <p>Step 3: 안전한 비밀번호를 설정해주세요.</p>
        <input
            ref={passwordRef}
            type="password"
            value={password}
            onChange={changeHandler}
            className={passwordValid ? '' : styles.invalidInput}
            placeholder="Enter your password"
        />
        {!passwordValid && <p className={styles.errorMessage}>{errorMessage}</p>}
        <input
            ref={passwordCheckRef}
            type="password"
            value={passwordCheck}
            onChange={checkHandler}
            placeholder="Enter your password"
        />
        {passwordCheck && <p className={styles.successMessage}>{success}</p>}
      </>
  );
};

export default PasswordInput;
