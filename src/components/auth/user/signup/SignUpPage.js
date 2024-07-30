import React, { useEffect, useState } from "react";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import NicknameInput from "./NicknameInput";
import AddressInput from "./AddressInput";
import PhoneNumberInput from "./PhoneNumberInput";
import { AUTH_URL } from "../../../../config/user/host-config";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 현재 몇 단계가 진행되고 있는지
  // const [success, setSuccess] = useState(false); // 단계가 성공적으로 완료되었는지
  const [enteredEmail, setEnteredEmail] = useState(""); // 입력된 이메일
  const [enteredPassword, setEnteredPassword] = useState(""); // 입력된 패스워드
  // const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordIsVaild, setPasswordIsValid] = useState(false);
  const [enteredNickname, setEnteredNickname] = useState(""); // 입력된 닉네임
  // const [nicknameValid, setNicknameValid] = useState(false);
  const [enteredAddress, setEnteredAddrrss] = useState(""); // 입력된 주소
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState(""); // 입력된 휴대폰 번호
  const [activeButton, setActiveButton] = useState(false); // 회원가입 버튼 활성화 여부

  // 다음 단계로 넘어가는 함수
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // 이메일 입력 성공
  const emailSuccessHandler = (email) => {
    setEnteredEmail(email);
    nextStep();
  };

  // 닉네임 입력 성공
  const nicknameSuccessHandler = (nickname) => {
    setEnteredNickname(nickname);
  };

  // 패스워드 입력 성공
  const passwordSuccessHandler = (password, isValid) => {
    if (isValid) {
      setEnteredPassword(password);
      setPasswordIsValid(isValid);
    }
    nextStep();
  };

  // 주소 입력 성공
  const addressSuccessHandler = () => {

  };

  // 휴대폰 번호 입력 성공
  const PhoneNumberSuccessHandler = () => {

  };

  // 서버에 회원가입 완료 요청하기
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      email: enteredEmail,
      password: enteredPassword,
      nickname: enteredNickname,
    };

    const response = await fetch(`${AUTH_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (result) {
      alert("회원가입에 성공하셨습니다");
      navigate("/");
    }
  };

  useEffect(() => {
    // 활성화 여부 감시
    const isActive = enteredEmail && enteredPassword && enteredNickname;
    setActiveButton(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname]);

  return (
    <form onSubmit={submitHandler}>
      <div className={styles.signupForm}>
        <div className={styles.formStepActive}>

        {/* {step === 1 && <div className={styles.emailBox}>
          <EmailInput onSuccess={emailSuccessHandler} />
          <VerificationInput email={enteredEmail} onSuccess={() => nextStep()} />
        </div>} */}
        
        {/* {step === 1 && <div className={styles.nickPwBox}>
          <NicknameInput onSuccess={nicknameSuccessHandler} />
          <PasswordInput onSuccess={passwordSuccessHandler} />
        </div>} */}

        {step === 1 && <div className={styles.addNumBox}>
          <AddressInput onSuccess={addressSuccessHandler} />
          <PhoneNumberInput onSuccess={PhoneNumberSuccessHandler} />
        </div>}

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
