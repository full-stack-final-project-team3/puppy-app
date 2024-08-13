import React from 'react';
import styles from './scss/OrderPage.module.scss';

const ProductInfo = ({ bundles, subscriptionPeriodLabels, subscriptionPeriods }) => (
  <div className={styles.section}>
    <div className={styles['section-title']}>상품 정보</div>
    <div className={styles['section-content']}>
      {bundles.map((bundle) => (
        <div key={bundle.id}>
          <h3>상품명: 반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</h3>
          <p>상품 구독 기간 : {subscriptionPeriodLabels[subscriptionPeriods[bundle.id]]}</p>
          <div>
            <p>패키지 리스트</p>
            {bundle.treats.map((treat) => (
              <p key={treat.id}>▶ {treat.treatsTitle}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductInfo;
