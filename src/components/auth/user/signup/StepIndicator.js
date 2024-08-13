import React from 'react';
import styles from './StepIndicator.module.scss';

const StepIndicator = ({ step, onStepClick }) => {
  const stepLabels = ['Email', 'Nickname Password', 'Address PhoneNumber', 'Add Dog'];

  return (
    <div className={styles.stepIndicator}>
      {[1, 2, 3, 4].map((num, idx) => (
        <React.Fragment key={num}>
          {idx > 0 && <div className={`${styles.stepLine} ${step > num - 1 ? styles.active : ''}`} />}
          <di1 v
            className={`${styles.stepContainer}`}
          >
            <div
              className={`${styles.stepNumber} ${step >= num ? styles.active : ''}`}
              onClick={num < step ? () => onStepClick(num) : null}
              style={{ cursor: num < step ? 'pointer' : 'default' }}
            >
              {num}
            </div>
            <div className={styles.stepLabel}>{stepLabels[num - 1]}</div>
          </di1>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
