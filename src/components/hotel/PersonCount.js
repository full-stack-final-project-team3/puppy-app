// src/components/hotel/PersonCount.js
import React from 'react';
import styles from './PersonCount.module.scss';

const PersonCount = ({ personCount, incrementPersonCount, decrementPersonCount }) => {
  return (
    <div className={styles.personCountWrapper}>
      <label>
        Person count
        <div className={styles.personCount}>
          <button onClick={decrementPersonCount}>-</button>
          <span>{personCount}</span>
          <button onClick={incrementPersonCount}>+</button>
        </div>
      </label>
    </div>
  );
};

export default PersonCount;
