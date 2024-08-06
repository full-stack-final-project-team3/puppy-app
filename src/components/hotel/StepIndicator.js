import React from 'react';
import styles from './StepIndicator.module.scss';

const StepIndicator = ({ step, onStepClick }) => {
  const stepLabels = ['Dates', 'Properties', 'Rooms', 'Summary', 'Confirm'];

  return (
    <div className={styles.stepIndicator}>
      {stepLabels.map((label, idx) => (
        <React.Fragment key={idx + 1}>
          {idx > 0 && <div className={`${styles.stepLine} ${step > idx ? styles.active : ''}`} />}
          <div className={styles.stepContainer}>
            <div
              className={`${styles.stepNumber} ${step >= idx + 1 ? styles.active : ''} ${step > idx + 1 ? styles.completed : ''}`}
              onClick={idx < step - 1 ? () => onStepClick(idx + 1) : null}
              style={{ cursor: idx < step - 1 ? 'pointer' : 'default' }}
            >
              {step >= idx + 1 ? idx + 1 : ''}
            </div>
            <div className={styles.stepLabel}>{label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
