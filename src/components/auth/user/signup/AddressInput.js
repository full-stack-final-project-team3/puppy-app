import React, { useState } from 'react';
import styles from "./SignUpPage.module.scss";

const AddressInput = () => {

  const [detailAddress, setDetailAddress] = useState(''); // 상세 주소

  const detailAddressInputHandler = e => {
    const address = e.target.value;
    setDetailAddress(address);
  }


  return (
    <div className={styles.signUpInput}>
      <div>
        <input
          type='address'
          className={styles.input}
          placeholder='지역주소'
        />
        <button className={styles.button}>주소 찾기</button>
      </div>

      <input
        type='address'
        value={detailAddress}
        onChange={detailAddressInputHandler}
        className={styles.input}
        placeholder='상세주소'
      />
    </div>
  )
}

export default AddressInput