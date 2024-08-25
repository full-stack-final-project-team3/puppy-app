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
import UserModal from "../mypage/UserModal"; // UserModal import

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

  // Modal 관련 상태
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleAddressSuccess = useCallback((address) => {
    setAddress(address);
  }, []);

  const emailSuccessHandler = useCallback((email) => {
    setEnteredEmail(email);
    setEmailVerified(true);
  }, []);

  const nicknameSuccessHandler = useCallback((nickname) => {
    setEnteredNickname(nickname);
  }, []);

  const passwordSuccessHandler = useCallback((password, isValid) => {
    setEnteredPassword(password);
    setPasswordIsValid(isValid);
  }, []);

  const phoneNumberSuccessHandler = useCallback((phoneNumber) => {
    setEnteredPhoneNumber(phoneNumber);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (enteredNickname === null) {
      alert("tlqkf")
    }
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

          // 모달을 열고 텍스트 설정
          setModalText("회원가입에 성공하셨습니다");
          setShowModal(true);

        } else {
          const errorText = await response.text();
        }
      } catch (err) {
        console.log("Unexpected error:", err);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const isActive = enteredEmail && enteredPassword && enteredNickname;
    setStep2Button(isActive);
  }, [enteredEmail, enteredPassword, enteredNickname]);

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

    const response1 = await fetch(`${AUTH_URL}/${enteredEmail}`);
    const userDetailData = await response1.json();
    dispatch(userEditActions.updateUserDetail(userDetailData));
    changeIsLogin(true);
    navigate("/add-dog");
  };

  const handleConfirmModal = () => {
    setShowModal(false);
    navigate("/"); // 모달 닫기 후 홈으로 이동
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
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
                            className={styles.active}
                            disabled={!step2Button}
                        >가입 완료</button>
                        <button
                            type="button"
                            className={styles.active}
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
                            className={`${step3Button ? styles.plusActive : styles.plusBtn}`}
                            disabled={!step3Button}
                            onClick={() => nextStep()}
                        >등록 완료</button>
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

        {showModal && (
            <UserModal
                title="회원가입 성공"
                message={modalText}
                onConfirm={handleConfirmModal}
                showCloseButton={false}
                onClose={handleCloseModal}
            />
        )}
      </>
  );
};

export default SignUpPage;
