import React from 'react';
import styles from './scss/OrderPage.module.scss';

const OrderInfo = ({
  user,
  orderInfo,
  handlePhoneNumberChange,
  handleAddressChange,
  handleAddressSearch,
}) => (
  <div>
    <div className={styles.section}>
      <div className={styles['section-title']}>구매자 정보</div>
      <div className={styles['section-content']}>
        <p>이름: {user.nickname}</p>
        <p>이메일: {user.email}</p>
        <div>
          <label>휴대폰 번호: </label>
          {user.phoneNumber ? (
            <p>{user.phoneNumber}</p>
          ) : (
            <input
              type="text"
              value={orderInfo.receiverPhone}
              onChange={handlePhoneNumberChange}
              placeholder="휴대폰 번호 입력"
              required
            />
          )}
        </div>
      </div>
    </div>

    <div className={styles.section}>
      <div className={styles['section-title']}>받는 사람 정보</div>
      <div className={styles['section-content']}>
        <p>이름: {orderInfo.receiverName}</p>
        <div>
          <label>휴대폰 번호: </label>
          {user.phoneNumber ? (
            <p>{user.phoneNumber}</p>
          ) : (
            <input
              type="text"
              value={orderInfo.receiverPhone}
              onChange={handlePhoneNumberChange}
              placeholder="휴대폰 번호 입력"
              required
            />
          )}
        </div>
        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={orderInfo.receiverAddress}
            onChange={handleAddressChange}
            required
            disabled
          />
          <button onClick={handleAddressSearch}>주소 검색</button>
        </div>
        <div>
          <input placeholder='나머지 주소를 입력해' />
        </div>
      </div>
    </div>

    <div className={styles.section}>
      <div className={styles['section-title']}>배송 정보</div>
      <div className={styles['section-content']}>
        <p>배송 요청 사항:</p>
        <select>
          <option value="문 앞">문 앞</option>
          <option value="직접 받고 부재 시 문 앞">직접 받고 부재 시 문 앞</option>
          <option value="경비실">경비실</option>
          <option value="택배함">택배함</option>
          <option value="기타사항">기타사항</option>
        </select>
      </div>
    </div>
  </div>
);

export default OrderInfo;
