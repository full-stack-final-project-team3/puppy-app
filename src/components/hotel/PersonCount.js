import React from 'react';
import PropTypes from 'prop-types';
import styles from './PersonCount.module.scss';

const PersonCount = ({ personCount, incrementPersonCount, decrementPersonCount }) => (
  <div className={styles.personCountWrapper}>
    <div className={styles.personCount}>
      <button
        type="button"
        onClick={decrementPersonCount}
        disabled={personCount <= 0}
      >
        -
      </button>
      <span>{personCount}</span>
      <button type="button" onClick={incrementPersonCount}>+</button>
    </div>
  </div>
);

PersonCount.propTypes = {
  personCount: PropTypes.number.isRequired,
  incrementPersonCount: PropTypes.func.isRequired,
  decrementPersonCount: PropTypes.func.isRequired,
};

export default PersonCount;
