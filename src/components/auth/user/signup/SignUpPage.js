import React, { useEffect, useState } from "react";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import NicknameInput from "./NicknameInput";
import AddressInput from "./AddressInput";
import PhoneNumberInput from "./PhoneNumberInput";
import { AUTH_URL } from "../../../../config/user/host-config";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 로그인 함수 가져오기

  const [step, setStep] = useState(1); // 현재 몇 단계가 진행되고 있는지
  const [enteredEmail, setEnteredEmail] = useState(""); // 입력된 이메일
  const [enteredPassword, setEnteredPassword] = useState(""); // 입력된 패스워드
  const [passwordIsVaild, setPasswordIsValid] = useState(false);
  const [enteredNickname, setEnteredNickname] = useState(""); // 입력된 닉네임
  const [enteredAddress, setEnteredAddress] = useState(""); // 입력된 주소
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState(""); // 입력된 휴대폰 번호
  const [activeButton, setActiveButton] = useState(false); // 회원가입 버튼 활성화 여부

  // 다음 단계로 넘어가는 함수
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // 이메일 입력
  const emailSuccessHandler = (email) => {
    setEnteredEmail(email);
  };

  // 닉네임 입력
  const nicknameSuccessHandler = (nickname) => {
    setEnteredNickname(nickname);
  };

  // 패스워드 입력
  const passwordSuccessHandler = (password, isValid) => {
    setEnteredPassword(password);
    setPasswordIsValid(isValid);
    nextStep();
  };

  // 주소 입력 
  const addressSuccessHandler = (address) => {
    setEnteredAddress(address);
  };

  // 휴대폰 번호 입력 
  const PhoneNumberSuccessHandler = (number) => {
    setEnteredPhoneNumber(number);
  };

  // 서버에 회원가입 완료 요청하기
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      email: enteredEmail,
      nickname: enteredNickname,
      password: enteredPassword,
      address: enteredAddress,
      number: enteredPhoneNumber
    };

    const response = await fetch(`${AUTH_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (result) {
      alert("회원가입에 성공하셨습니다");
      login(); // 회원가입이 완료되면 로그인 상태로 설정
      navigate("/add-dog");
    }
  };

  useEffect(() => {
    // 활성화 여부 감시
    const isActive = enteredEmail && enteredPassword && enteredNickname;
    setActiveButton(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname]);

  return (
    <form onSubmit={submitHandler}>
      <div className={styles.signupPage}>
        <div className={styles.formStepActive}>

        {step === 1 && <div className={styles.signupBox}>
          <EmailInput onSuccess={emailSuccessHandler} />
          <VerificationInput email={enteredEmail} onSuccess={() => nextStep()} />
        </div>}
        
        {step === 2 && <div className={styles.signupBox}>
          <NicknameInput onSuccess={nicknameSuccessHandler} />
          <PasswordInput onSuccess={passwordSuccessHandler} />
        </div>}

        {step === 3 && <div className={styles.signupBox}>
          <Link to='/'><button className={styles.button}>나중에 등록하기</button></Link>
          <AddressInput />
          <PhoneNumberInput />
        </div>}

          {activeButton && (
            <div>
              <button className={styles.button}>회원가입</button>
            </div>
          )}

        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
