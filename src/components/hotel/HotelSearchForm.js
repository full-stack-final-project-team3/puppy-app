// src/components/hotel/HotelSearchForm.js
import React from 'react';
import { Link } from 'react-router-dom';
import PersonCount from './PersonCount';
import styles from './HotelSearchForm.module.scss';

const cities = ["서울", "부산", "인천", "대구", "대전", "광주", "수원", "울산", "고양", "용인"];

const HotelSearchForm = ({ isAdmin, personCount, incrementPersonCount, decrementPersonCount, handleNextStep }) => {
  return (
    <div className={styles.stepContent}>
      {isAdmin && (
        <div className={styles.addHotelButtonContainer}>
          <button className={styles.addHotelButton}>
            <Link to="/add-hotel">호텔 추가</Link>
          </button>
        </div>
      )}
      <label>
        Location
        <select>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>
      <label>
        Dates
        <input type="text" placeholder="Select dates" readOnly />
      </label>
      <div className={styles.personCountWrapper}>
        <PersonCount 
          personCount={personCount} 
          incrementPersonCount={incrementPersonCount} 
          decrementPersonCount={decrementPersonCount} 
        />
      </div>
      <button className={styles.next} onClick={handleNextStep}>Next</button>
    </div>
  );
};

export default HotelSearchForm;
