import React from 'react';
import styles from './scss/OrderPage.module.scss';

const ProductInfo = ({ bundles, subscriptionPeriodLabels, subscriptionPeriods }) => (
  <div className={styles.section}>
    <div className={styles['section-title']}>상품 정보</div>
    <div className={styles['section-content']}>
      {bundles.map((bundle) => (
        <div key={bundle.id}>
          <div className={styles.Product_title}>
            <h3>
              반려견 전용 맞춤형 푸드 패키지 For <span>{bundle.dogName}</span>
            </h3>
            <p>
              상품 구독 기간 : 
              <span>{subscriptionPeriodLabels[subscriptionPeriods[bundle.id]]}</span>
            </p>
          </div>
          <div>
            {/* <p>패키지 리스트</p> */}
            {bundle.treats.map((treat) => (
              <p key={treat.id}>·  {treat.treatsTitle}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProductInfo;
