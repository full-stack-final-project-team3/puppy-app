import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import NicknameInput from "./NicknameInput";
import AddressInput from "./AddressInput";
import PhoneNumberInput from "./PhoneNumberInput";
import AddDogInput from "./AddDogInput";
import { AUTH_URL } from "../../../../config/user/host-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import StepIndicator from "./StepIndicator";
import { useDispatch } from "react-redux";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth(); // 로그인 함수 가져오기
  const nodeRef = useRef(null);

  const [step, setStep] = useState(1); // 현재 단계
  const [enteredEmail, setEnteredEmail] = useState(""); // 입력된 이메일
  const [emailVerified, setEmailVerified] = useState(false); // 이메일 검증 여부
  const [enteredPassword, setEnteredPassword] = useState(""); // 입력된 패스워드
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [enteredNickname, setEnteredNickname] = useState(""); // 입력된 닉네임
  const [enteredAddress, setEnteredAddress] = useState(""); // 입력된 주소
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState(""); // 입력된 휴대폰 번호
  const [step2Button, setStep2Button] = useState(false); // step2 버튼 활성화 여부
  const [step3Button, setStep3Button] = useState(false); // step3 버튼 활성화 여부

  // 다음 단계로 넘어가는 함수
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // 이메일 입력 성공 핸들러
  const emailSuccessHandler = (email) => {
    setEnteredEmail(email);
    setEmailVerified(true); // 이메일 검증 완료 상태로 변경
  };

  // 닉네임 입력 성공 핸들러
  const nicknameSuccessHandler = (nickname) => {
    setEnteredNickname(nickname);
  };

  // 패스워드 입력 성공 핸들러
  const passwordSuccessHandler = (password, isValid) => {
    setEnteredPassword(password);
    setPasswordIsValid(isValid);
  };

  // 주소 입력 성공 핸들러
  const addressSuccessHandler = (address) => {
    setEnteredAddress(address);
  };

  // 휴대폰 번호 입력 성공 핸들러
  const phoneNumberSuccessHandler = (phoneNumber) => {
    setEnteredPhoneNumber(phoneNumber);
  };

  // 서버에 회원가입 완료 요청하기
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      email: enteredEmail,
      nickname: enteredNickname,
      password: enteredPassword,
      address: enteredAddress,
      phoneNumber: enteredPhoneNumber,
    };

    const response = await fetch(`${AUTH_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (result) {
      alert("회원가입에 성공하셨습니다");
      navigate("/login");
    }
  };

  // 스텝2 가입완료 버튼, 스텝2 추가정보 등록 버튼
  // 이메일, 닉네임, 비밀번호 입력 완료되면 활성화
  useEffect(() => {
    // 활성화 여부 감시
    const isActive =
      enteredEmail && enteredPassword && enteredNickname 
      ;

    setStep2Button(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname]);

  // 스텝3 추가정보 등록 완료 버튼, 스텝3 강아지 등록하기 버튼
  // 이메일, 닉네임, 비밀번호, 주소, 전화번호 입력 완료되면 활성화
  useEffect(() => {
    // 활성화 여부 감시
    const isActive = enteredEmail && enteredPassword 
    && enteredNickname && enteredPhoneNumber;

    setStep3Button(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname, enteredPhoneNumber]);

  const handleStepClick = (num) => {
    if (num < step) {
      dispatch(setStep(num));
    }
  };

  // 자동 로그인
  const autoLoginHandler = async () => {
    try {
      await login(enteredEmail, enteredPassword); // 자동 로그인 수행
      navigate("/add-dog"); // 로그인 성공 후 이동할 페이지로 변경
    } catch (error) {
      alert("에러 발생");
    }
  };

  return (
    <>
      <StepIndicator step={step} onStepClick={handleStepClick} />
      <CSSTransition
        key={step}
        timeout={300}
        classNames="page"
        nodeRef={nodeRef}
      >
        <form onSubmit={submitHandler}>
          <div className={styles.signUpPage}>
            <div className={styles.formStepActive}>

              {step === 1 && (
                <div className={styles.signUpBox}>
                  <EmailInput onSuccess={emailSuccessHandler} />
                  {emailVerified && (
                    <VerificationInput
                      email={enteredEmail}
                      onSuccess={() => nextStep()}
                    />
                  )}
                </div>
              )}

              {step === 2 && (
                <div className={styles.signUpBox}>
                  <NicknameInput onSuccess={nicknameSuccessHandler} />
                  <PasswordInput onSuccess={passwordSuccessHandler} />
                  <button
                    type="submit"
                    className={`${styles.button} ${step2Button ? styles.active : styles.inactive}`}
                    disabled={!step2Button}
                  >가입 완료</button>
                  <button
                    type="submit"
                    className={`${styles.button} ${step2Button ? styles.active : styles.inactive}`}
                    disabled={!step2Button}
                    onClick={() => nextStep()}
                    >추가정보 등록</button>
                </div>
              )}

              {step === 3 && (
                <div className={styles.signUpBox}>
                  <AddressInput onSuccess={addressSuccessHandler} />
                  <PhoneNumberInput onSuccess={phoneNumberSuccessHandler} />
                    <button
                      type="submit"
                      className={`${styles.button} ${step3Button ? styles.active : styles.inactive}`}
                      disabled={!step3Button}
                    >추가정보 등록 완료</button>
                    <button 
                      type="button"
                      className={`${styles.button} ${step3Button ? styles.active : styles.inactive}`}
                      disabled={!step3Button}
                      onClick={autoLoginHandler}
                      >강아지 등록하기</button>
                </div>
              )}

              {step === 4 && (
                <div className={styles.signUpBox}> 
                  <AddDogInput />
                </div>
              )}

            </div>
          </div>
        </form>
      </CSSTransition>
    </>
  );
};

export default SignUpPage;
