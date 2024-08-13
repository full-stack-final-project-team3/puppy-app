import React from 'react';
import styles from './scss/OrderPage.module.scss';

const PaymentInfo = ({
  totalPrice,
  pointUsage,
  finalPrice,
  handlePaymentMethodClick,
  showPointPayment,
  handlePointChange,
  handleUseAllPoints,
  user,
}) => {
  // 사용 후 남은 포인트 계산
  const remainingPoints = user.point - pointUsage;

  return (
    <div>
      <div className={styles.section}>
        <div className={styles['section-title']}>결제 정보</div>
        <div className={styles['section-content']}>
          <p>총 상품 가격: {totalPrice.toLocaleString()}원</p>
          <p>포인트 결제 차감: -{pointUsage.toLocaleString()}원</p>
          <p>최종 결제 금액: {finalPrice.toLocaleString()}원</p>
        </div>
        <div className={styles['payment-methods']}>
          <button onClick={() => handlePaymentMethodClick('bankTransfer')}>무통장입금</button>
          <button onClick={() => handlePaymentMethodClick('creditCard')}>신용카드</button>
          <button onClick={() => handlePaymentMethodClick('virtualAccount')}>가상계좌</button>
          <button onClick={() => handlePaymentMethodClick('accountTransfer')}>계좌이체</button>
          <button onClick={() => handlePaymentMethodClick('point')}>포인트</button>
        </div>
      </div>

      {showPointPayment && (
        <div className={styles.pointPayment}>
          <h3 className={styles['section-title']}>포인트 결제</h3>
          <input
            type="number"
            value={pointUsage}
            onChange={handlePointChange}
            placeholder="포인트 사용"
            className={styles.inputBox}
          />
          <button className={styles.useAllPointsButton} onClick={handleUseAllPoints}>
            모두사용
          </button>
          <p className={styles.pointPaymentMessage}>사용 가능: {user.point.toLocaleString()}p</p>
          <p>사용 후 남은 포인트: {remainingPoints.toLocaleString()}p</p>
        </div>
      )}
    </div>
  );
};

export default PaymentInfo;
