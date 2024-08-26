import React, { useEffect, useRef, useState } from "react";
import styles from "./VerificationInput.module.scss";
import { debounce } from "lodash";
import { AUTH_URL } from "../../../../config/user/host-config";

const VerificationInput = ({ email, onSuccess }) => {
  const inputsRef = useRef([]);

  const [codes, setCodes] = useState(Array(4).fill(""));
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(300);

  const focusNextInput = (index) => {
    if (index < inputsRef.current.length) {
      inputsRef.current[index].focus();
    }
  };

  const debouncedVerifyCode = debounce(async (code) => {
    await verifyCode(code);
  }, 1500);

  const verifyCode = async (code) => {
    try {
      const response = await fetch(
          `${AUTH_URL}/code?email=${email}&code=${code}`
      );
      const flag = await response.json();

      if (!flag) {
        setError("유효하지 않거나 만료된 코드입니다. 인증코드를 재발송합니다.");
        setCodes(Array(4).fill(""));
        setTimer(300);
        inputsRef.current[0].focus();
      } else {
        setSuccess("인증이 완료되었습니다.");
        setError('');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      console.error("Verification failed", err);
      setError("서버와의 통신에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const checkCodeWithDebounce = async (e) => {
    const code = codes.join("");

    if (e.key === "Enter" && code.length === 4) {
      try {
        console.log("enter touch")
        const response = await fetch(
            `${AUTH_URL}/code?email=${email}&code=${code}`
        );
        const flag = await response.json();

        if (!flag) {
          setError("유효하지 않거나 만료된 코드입니다. 인증코드를 재발송합니다.");
          setCodes(Array(4).fill(""));
          // setTimer(300);
          inputsRef.current[0].focus();
        } else {
          setSuccess("인증이 완료되었습니다.");
          setError('');
          onSuccess();
        }
      } catch (err) {
        console.error("Verification failed", err);
        setError("서버와의 통신에 실패했습니다. 다시 시도해주세요.");
      }

    }
  };

  const changeHandler = (index, inputValue) => {
    const updatedCodes = [...codes];
    updatedCodes[index - 1] = inputValue;

    setCodes(updatedCodes);

    if (inputValue && index < 4) {
      focusNextInput(index);
    }

    if (updatedCodes.every((code) => code !== "")) {
      debouncedVerifyCode(updatedCodes.join(""));
    }
  };

  useEffect(() => {
    inputsRef.current[0].focus();

    const intervalId = setInterval(() => {
      setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
      <div className={styles.signUpInput}>
        <h2 className={styles.h2}>인증코드</h2>
        <div className={styles.codeInputWrapper}>
        {Array.from(new Array(4)).map((_, index) => (
            <input
                ref={($input) => (inputsRef.current[index] = $input)}
                key={index}
                type="text"
                className={styles.codeInput}
                maxLength={1}
                onChange={(e) => changeHandler(index + 1, e.target.value)}
                value={codes[index]}
            />
        ))}
        </div>
        <div className={styles.timer}>
          {`${"0" + Math.floor(timer / 60)}:${("0" + (timer % 60)).slice(-2)}`}
        </div>
        {success && <p className={styles.successMessage}>{success}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
  );
};

export default VerificationInput;
