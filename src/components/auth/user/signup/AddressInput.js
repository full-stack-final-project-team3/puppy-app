import React, { useState } from "react";
import styles from "./SignUpPage.module.scss";

const AddressInput = () => {

  const [detailAddress, setDetailAddress] = useState(""); // 상세 주소

  const detailAddressInputHandler = (e) => {
    const address = e.target.value;
    setDetailAddress(address);
  };

  return (
    <>
      <h1 className={styles.h1}>Step 3</h1>
      <div className={styles.signUpInput}>
        <h2 className={styles.h2}>주소</h2>
        <div>
          <input
            type="address"
            className={styles.input}
            placeholder="지역주소"
          />
          <button className={styles.addressBtn}>주소 찾기</button>
        </div>

        <input
          type="address"
          value={detailAddress}
          onChange={detailAddressInputHandler}
          className={styles.input}
          placeholder="상세주소"
        />
      </div>
    </>
  );
};

export default AddressInput;
