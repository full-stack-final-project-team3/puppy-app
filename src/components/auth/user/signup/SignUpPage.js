import React, { useEffect, useState } from "react";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import { AUTH_URL } from "../../../../config/user/host-config";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  // 현재 몇 단계가 진행되고 있는지
  const [step, setStep] = useState(1);

  // 단계가 성공적으로 완료되었는지
  const [success, setSuccess] = useState(false);

  // 입력된 이메일
  const [enteredEmail, setEnteredEmail] = useState("");
  // 입력된 패스워드
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsVaild, setPasswordIsValid] = useState(false);

  // 회원가입 버튼 활성화 여부
  const [activeButton, setActiveButton] = useState(false);

  // 다음 단계로 넘어가는 함수
  const nextStep = () => {
    setSuccess(true);

    setTimeout(() => {
      setStep((prevStep) => prevStep + 1);
      setSuccess(false);
    }, 1500);
  };

  // 이메일 중복확인이 끝났을 때 호출될 함수
  const emailSuccessHandler = (email) => {
    setEnteredEmail(email);
    nextStep();
  };

  const passwordSuccessHandler = (password, isValid) => {
    setEnteredPassword(password);
    setPasswordIsValid(isValid);
  };

  // 서버에 회원가입 완료 요청하기
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      email: enteredEmail,
      password: enteredPassword,
    };

    const response = await fetch(`${AUTH_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (result) {
      alert("회원가입에 성공하셨습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    // 활성화 여부 감시
    const isActive = enteredEmail && passwordIsVaild;
    setActiveButton(isActive);
  }, [enteredEmail, enteredPassword, passwordIsVaild]);

  return (
    <form onSubmit={submitHandler}>
      <div className={styles.signupForm}>
        <div className={styles.formStepActive}>
          {step === 1 && <EmailInput onSuccess={emailSuccessHandler} />}

          {step === 2 && (
            <VerificationInput
              email={enteredEmail}
              onSuccess={() => nextStep()}
            />
          )}

          {step === 3 && <PasswordInput onSuccess={passwordSuccessHandler} />}

          {activeButton && (
            <div>
              <button className={styles.button}>회원가입 완료</button>
            </div>
          )}

        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
