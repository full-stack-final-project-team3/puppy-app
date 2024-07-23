import React, { useEffect, useState } from "react";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import { AUTH_URL } from '../../../../config/user/host-config';
import { useNavigate } from "react-router-dom";
import NickNameInput from "./NickNameInput";
import PhoneNumberInput from "./PhoneNumberInput";
import BirthInput from "./BirthInput";
import AddressInput from "./AddressInput";
import DogInfoInput from "./DogInfoInput";

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
  // 입력된 닉네임
  const [enteredNickName, setEnteredNickName] = useState("");
  // 입력된 휴대폰 번호 (4단계부턴 스킵 후 나중에 정보수정으로 변경가능)
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  // 입력된 가입자의 생년월일
  const [enteredUserBirth, setEnteredUserBirth] = useState("");
  // 입력된 주소
  const [enteredAddress, setEnteredAddress] = useState("");
  // 입력된 강아지 정보
  const [enteredDogInfo, setEnteredDogInfo] = useState("");

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

  // 비밀번호 입력
  const passwordSuccessHandler = (password, isValid) => {
    setEnteredPassword(password);
    setPasswordIsValid(isValid);
    nextStep();
  };

  // 닉네임 입력
  const nickNameSuccessHandler = (nickName) => {
    setEnteredNickName(nickName);
    nextStep();
  };

  // 휴대폰 번호 입력
  const phoneNumberSuccessHandler = (phoneNumber) => {
    setEnteredPhoneNumber(phoneNumber);
    nextStep();
  };

  // 생년월일 입력
  const userBirthSuccessHandler = (userBirth) => {
    setEnteredUserBirth(userBirth);
    nextStep();
  };

  // 주소 입력
  const addressSuccessHandler = (address) => {
    setEnteredAddress(address);
    nextStep();
  }

  // 강아지 정보 입력
  const dogInfoSuccessHandler = (dogInfo) => {
    setEnteredDogInfo(dogInfo);
  }

  // 서버에 회원가입 완료 요청하기
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      email: enteredEmail,
      password: enteredPassword,
      nickName: enteredNickName,
      phoneNumber: enteredPhoneNumber,
      userBirth: enteredUserBirth,
      address: enteredAddress,
      dogInfo: enteredDogInfo,
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
    const isActive = enteredEmail && passwordIsVaild && enteredNickName && enteredPhoneNumber && enteredUserBirth && enteredAddress && enteredDogInfo;
    setActiveButton(isActive);
  }, [enteredEmail, enteredPassword, passwordIsVaild, enteredNickName, enteredPhoneNumber, enteredUserBirth, enteredAddress, enteredDogInfo]);

  return (
    <form onSubmit={submitHandler}>
      <div className={styles.signupForm}>
        <div className={styles.formStepActive}>
          {step === 1 && <EmailInput onSuccess={emailSuccessHandler} /> }

          {step === 2 && (
            <VerificationInput
              email={enteredEmail}
              onSuccess={() => nextStep()}
            />
          )}

          {step === 3 && <PasswordInput onSuccess={passwordSuccessHandler} />}

          {step === 4 && <NickNameInput onSuccess={nickNameSuccessHandler} />}

          {step === 5 && <PhoneNumberInput onSuccess={phoneNumberSuccessHandler} />}

          {step === 6 && <BirthInput onSuccess={userBirthSuccessHandler} />}

          {step === 7 && <AddressInput onSuccess={addressSuccessHandler} />}

          {step === 8 && <DogInfoInput onSuccess={dogInfoSuccessHandler} />}

          {activeButton && (
            <div>
              <button>회원가입 완료</button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;
