import React from 'react';
import styles from './ShopStepIndicator.module.scss';

const ShopStepIndicator = ({ step = 0, onStepClick }) => {
  const stepLabels = ['간식(건식)', '간식(습식)', '껌', '사료', '영양제'];

  return (
    <div className={styles.shopStepIndicator}>
      {stepLabels.map((label, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div
              className={`${styles.shopStepLine} ${step >= idx ? styles.active : ''}`} // 현재 및 이전 단계에서 선 활성화
            />
          )}
          <div className={styles.shopStepContainer}>
            <div
              className={`${styles.shopStepNumber} ${step >= idx ? styles.active : ''} ${step > idx ? styles.completed : ''}`}
              // onClick={idx <= step ? () => onStepClick(idx) : null} // 현재 및 이전 단계 클릭 가능
              style={{ cursor: idx <= step ? 'default' : 'default' }}
            >
              {idx <= step ? idx + 1 : null} {/* 실행된 스텝에서만 숫자 렌더링 */}
            </div>
            <div className={styles.shopStepLabel}>{label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ShopStepIndicator;
