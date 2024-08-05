import React, { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import NicknameInput from "./NicknameInput";
import AddressInput from "./AddressInput";
import PhoneNumberInput from "./PhoneNumberInput";
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
  const [activeButton, setActiveButton] = useState(false); // 회원가입 버튼 활성화 여부

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
    nextStep();
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

  useEffect(() => {
    // 활성화 여부 감시
    const isActive =
      enteredEmail && enteredPassword && enteredNickname && enteredPhoneNumber;

    setActiveButton(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname, enteredPhoneNumber]);

  const handleStepClick = (num) => {
    if (num < step) {
      dispatch(setStep(num));
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
                </div>
              )}

              {step === 3 && (
                <div className={styles.signUpBox}>
                  <button className={styles.signUpBtn}>
                    나중에 등록하기
                  </button>
                  <AddressInput onSuccess={addressSuccessHandler} />
                  <PhoneNumberInput onSuccess={phoneNumberSuccessHandler} />
                  <button
                    className={`${styles.button} ${activeButton ? styles.active : styles.inactive}`}
                    disabled={!activeButton}
                  >
                    회원가입
                  </button>
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
