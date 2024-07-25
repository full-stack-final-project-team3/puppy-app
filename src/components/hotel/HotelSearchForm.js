import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HotelSearchForm.module.scss';
import PersonCount from './PersonCount';

const cities = ["서울", "부산", "인천", "대구", "대전", "광주", "수원", "울산", "고양", "용인", "경기"];

const HotelSearchForm = ({ isAdmin, personCount, incrementPersonCount, decrementPersonCount, handleNextStep, onSearch }) => {
  const [selectedCity, setSelectedCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(selectedCity);
    handleNextStep();
  };

  return (
    <div className={styles.stepContent}>
      {isAdmin && (
        <div className={styles.addHotelButtonContainer}>
          <button className={styles.addHotelButton}>
            <Link to="/add-hotel">호텔 추가</Link>
          </button>
        </div>
      )}
      <form onSubmit={handleSearch}>
        <label>
          Location
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option value="">Select a city</option>
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
        <button className={styles.next} type="submit">Search</button>
      </form>
    </div>
  );
};

export default HotelSearchForm;
