// SignUpPage.js
import React, { useEffect, useRef, useState, useContext, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./SignUpPage.module.scss";
import EmailInput from "./EmailInput";
import VerificationInput from "./VerificationInput";
import PasswordInput from "./PasswordInput";
import NicknameInput from "./NicknameInput";
import AddressInput from "./AddressInput";
import PhoneNumberInput from "./PhoneNumberInput";
import { AUTH_URL, NOTICE_URL } from "../../../../config/user/host-config";
import { useNavigate } from "react-router-dom";
import StepIndicator from "./StepIndicator";
import { useDispatch } from "react-redux";
import UserContext from "../../../context/user-context";
import { userEditActions } from "../../../store/user/UserEditSlice";
import WelcomePage from "./WelcomePage";

const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const nodeRef = useRef(null);

  const [step, setStep] = useState(1);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [enteredNickname, setEnteredNickname] = useState("");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
  const [step2Button, setStep2Button] = useState(false);
  const [step3Button, setStep3Button] = useState(false);
  const [address, setAddress] = useState({ localAddress: "", detailAddress: "" });
  const { changeIsLogin, setUser } = useContext(UserContext);

   // 다음 단계로 넘어가는 함수
   const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  // 주소 입력 성공 핸들러
  const handleAddressSuccess = useCallback((address) => {
    setAddress(address);
  }, []);

  // 이메일 입력 성공 핸들러
  const emailSuccessHandler = useCallback((email) => {
    setEnteredEmail(email);
    setEmailVerified(true);
  }, []);

  // 닉네임 입력 성공 핸들러
  const nicknameSuccessHandler = useCallback((nickname) => {
    setEnteredNickname(nickname);
  }, []);

  // 패스워드 입력 성공 핸들러
  const passwordSuccessHandler = useCallback((password, isValid) => {
    setEnteredPassword(password);
    setPasswordIsValid(isValid);
  }, []);

  // 휴대폰 번호 입력 성공 핸들러
  const phoneNumberSuccessHandler = useCallback((phoneNumber) => {
    setEnteredPhoneNumber(phoneNumber);
  }, []);

  // 서버에 회원가입 완료 요청하기
  const submitHandler = async (e) => {
    e.preventDefault();
    const payload = {
      email: enteredEmail,
      nickname: enteredNickname,
      password: enteredPassword,
      phoneNumber: enteredPhoneNumber,
      address: address.localAddress,
      detailAddress: address.detailAddress,
    };
    
    const response = await fetch(`${AUTH_URL}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (result) {
      try {
        const response = await fetch(`${AUTH_URL}/sign-in`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const userDetailData = await (await fetch(`${AUTH_URL}/${enteredEmail}`)).json();
          const noticeData = await (await fetch(`${NOTICE_URL}/user/${userDetailData.id}`)).json();

          dispatch(userEditActions.saveUserNotice(noticeData));
          dispatch(userEditActions.updateUserDetail(userDetailData));

          const responseData = await response.json();
          localStorage.setItem("userData", JSON.stringify(responseData));
          setUser(responseData);
          changeIsLogin(true);
          alert("회원가입에 성공하셨습니다");
          navigate("/");

        } else {
          const errorText = await response.text();
        }
      } catch (err) {
        console.log("Unexpected error:", err);
      }
    }
  };

  // 키보드 엔터키 회원가입 방지
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // 스텝2 가입완료 버튼, 스텝2 추가정보 등록 버튼
  useEffect(() => {
    // 활성화 여부 감시
    const isActive =
        enteredEmail && enteredPassword && enteredNickname;
    
    setStep2Button(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname]);

  // 스텝3 추가정보 등록 완료 버튼, 스텝3 강아지 등록하기 버튼
  useEffect(() => {
    const isActive = enteredEmail && enteredPassword
        && enteredNickname && enteredPhoneNumber
        && address.localAddress && address.detailAddress;

    setStep3Button(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname, enteredPhoneNumber, address]);

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
      phoneNumber: enteredPhoneNumber,
      address: address.localAddress,
      detailAddress: address.detailAddress,
    };

    const response = await fetch(`${AUTH_URL}/register-and-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    localStorage.setItem("userData", JSON.stringify(responseData));
    setUser(responseData);

    // 회원가입 유저 디테일 정보 전송
    const response1 = await fetch(`${AUTH_URL}/${enteredEmail}`);
    const userDetailData = await response1.json();
    dispatch(userEditActions.updateUserDetail(userDetailData));
    changeIsLogin(true);
    navigate("/add-dog");
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
        <form onSubmit={submitHandler} onKeyDown={handleKeyDown}>
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
                  <div className={styles.btnBox}>
                    <button
                      type="submit"
                      className={`${step2Button ? styles.active : styles.button}`}
                      disabled={!step2Button}
                    >가입 완료</button>
                    <button
                      type="button"
                      className={`${step2Button ? styles.active : styles.button}`}
                      disabled={!step2Button}
                      onClick={() => nextStep()}
                    >추가정보 등록</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className={styles.signUpBox}>
                  <AddressInput onSuccess={handleAddressSuccess} />
                  <PhoneNumberInput onSuccess={phoneNumberSuccessHandler} />
                  <div className={styles.btnBox}>
                    <button
                      type="submit"
                      className={`${step3Button ? styles.active : styles.button}`}
                      disabled={!step3Button}
                      onClick={() => nextStep()}
                    >추가정보 등록 완료</button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <WelcomePage onAddDogClick={autoLoginHandler} />
              )}
            </div>
            </div>
          </form>
        </CSSTransition>
      </>
  );
};

export default SignUpPage;