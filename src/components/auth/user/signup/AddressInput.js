import React, { useEffect, useRef, useState } from "react";
import styles from "./SignUpPage.module.scss";

const AddressInput = () => {
  const inputRef = useRef();

  const [address, setAddress] = useState(""); // 상세 주소

  const addressInputHandler = (e) => {
    const address = e.target.value;
    setAddress(address);
  };

  // 렌더링 되자마자 입력창에 포커싱
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <h1 className={styles.h1}>Step 3</h1>
      <div className={styles.signUpInput}>
        <h2 className={styles.h2}>주소</h2>
        <div>
          <input
            ref={inputRef}
            type="address"
            value={address}
            onChange={addressInputHandler}
            className={styles.input}
            placeholder="지역주소"
          />
          {/* <button className={styles.addressBtn}>주소 찾기</button> */}
        </div>

        <input
          type="address"
          value={address}
          onChange={addressInputHandler}
          className={styles.input}
          placeholder="상세주소"
        />
      </div>
    </>
  );
};

export default AddressInput;
