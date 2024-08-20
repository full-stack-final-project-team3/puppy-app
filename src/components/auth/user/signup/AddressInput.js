import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { updateHotelData } from "../../../store/hotel/HotelAddSlice";
import styles from "./AddressInput.module.scss";

const AddressInput = ({ onSuccess }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();

  const [localAddress, setLocalAddress] = useState(""); // 지역 주소
  const [detailAddress, setDetailAddress] = useState(""); // 상세 주소

  // 지역 주소
  const localInputHandler = (e) => {
    const local = e.target.value;
    setLocalAddress(local);
  };

  // 상세 주소
  const detailInputHandler = (e) => {
    const detail = e.target.value;
    setDetailAddress(detail);
  };

  const openKakaoAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setLocalAddress(data.address);
        dispatch(updateHotelData({ location: data.address }));
        onSuccess({ localAddress: data.address, detailAddress });
      }
    }).open();
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (localAddress && detailAddress) {
      onSuccess({ localAddress, detailAddress });
    }
  }, [localAddress, detailAddress]); // onSuccess를 의존성 배열에서 제거

  return (
      <>
        <h1 className={styles.h1}>Step 3</h1>
        <div className={styles.signUpInput}>
          <h2 className={styles.h2}>주소</h2>
          <div>
            <input
                ref={inputRef}
                type="text"
                value={localAddress}
                onChange={localInputHandler}
                className={styles.localInput}
                placeholder="지역주소"
            />
            <button type="button" className={styles.addressBtn} onClick={openKakaoAddress}>주소 찾기</button>
          </div>

          <input
              type="text"
              value={detailAddress}
              onChange={detailInputHandler}
              className={styles.detailInput}
              placeholder="상세주소"
          />
        </div>
      </>
  );
};

export default AddressInput;