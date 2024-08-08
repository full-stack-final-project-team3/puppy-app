import React, { useEffect, useRef, useState, useContext } from "react";
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
import StepIndicator from "./StepIndicator";
import { useDispatch } from "react-redux";
import UserContext from "../../../context/user-context";
import { userEditActions } from "../../../store/user/UserEditSlice";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const { changeIsLogin, setUser } = useContext(UserContext);

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
      address: enteredAddress, // 지역주소와 상세주소를 합쳐서 전송
      phoneNumber: enteredPhoneNumber,
    };

    console.log(payload);
    console.log('enteredAddress: ', enteredAddress);
    

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
      enteredEmail && enteredPassword && enteredNickname;

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
  
  // 회원가입을 완료하면 자동로그인 실행
  const autoLoginHandler = async () => {
    const payload = {
      email: enteredEmail,
      password: enteredPassword,
      nickname: enteredNickname,
      address: enteredAddress, // 지역주소와 상세주소를 합쳐서 전송
      phoneNumber: enteredPhoneNumber
    };

    console.log(payload);
    
    const response = await fetch(`${AUTH_URL}/register-and-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 회원가입 유저 정보 전송
    const responseData = await response.json();
    localStorage.setItem("userData", JSON.stringify(responseData));
    setUser(responseData);
    
    // 회원가입 유저 디테일 정보 전송
    const response1 = await fetch(`${AUTH_URL}/${enteredEmail}`);
    const userDetailData = await response1.json();
    dispatch(userEditActions.updateUserDetail(userDetailData));
        
    changeIsLogin(true); // 상태 업데이트
    alert("강아지 등록하러갑니다")
    navigate("/add-dog"); // 로그인 후 리디렉트할 경로
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
                    type="button"
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
