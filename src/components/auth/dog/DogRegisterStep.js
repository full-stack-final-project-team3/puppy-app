import React from 'react';
import styles from './DogRegisterStep.module.scss';

const DogRegisterStep = ({ step, onStepClick }) => {
    return (
        <div className={styles.stepIndicator}>
            {[1, 2, 3, 4, 5].map((num, idx) => (
                <React.Fragment key={num}>
                    {idx > 0 && <div className={`${styles.stepLine} ${step > num - 1 ? styles.active : ''}`} />}
                    <div
                        className={`${styles.stepNumber} ${step >= num ? styles.active : ''}`}
                        onClick={num === 1 ? () => onStepClick(num) : null}
                        style={{ cursor: num === 1 ? 'pointer' : 'default' }}
                    >
                        {num}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default DogRegisterStep;
