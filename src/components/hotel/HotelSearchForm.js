import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './HotelSearchForm.module.scss';
import PersonCount from './PersonCount';
import DualDatePickers from './Hoteldates';
import {
  setSelectedCity,
  setStartDate,
  setEndDate,
  incrementPersonCount,
  decrementPersonCount,
  setShowWarning,
} from '../../components/store/hotel/ReservationSlice';
import dayjs from 'dayjs';

const cities = ["서울", "부산", "인천", "대구", "대전", "광주", "수원", "울산", "고양", "용인", "경기"];

const HotelSearchForm = ({ isAdmin, handleNextStep, onSearch }) => {
  const dispatch = useDispatch();
  const { selectedCity, startDate, endDate, personCount, showWarning } = useSelector((state) => state.reservation);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      dispatch(setShowWarning(true));
    } else {
      dispatch(setShowWarning(false));
      onSearch(selectedCity);
      handleNextStep();
    }
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
            <select value={selectedCity} onChange={(e) => dispatch(setSelectedCity(e.target.value))}>
              <option value="">Select a city</option>
              {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>
          <label>
            <DualDatePickers
                startDate={startDate ? dayjs(startDate) : null}
                setStartDate={(date) => dispatch(setStartDate(date.toISOString()))}
                endDate={endDate ? dayjs(endDate) : null}
                setEndDate={(date) => dispatch(setEndDate(date.toISOString()))}
            />
          </label>
          <div className={styles.personCountWrapper}>
            <PersonCount
                personCount={personCount}
                incrementPersonCount={() => dispatch(incrementPersonCount())}
                decrementPersonCount={() => dispatch(decrementPersonCount())}
            />
          </div>
          <button className={styles.next} type="submit">Search</button>
          {showWarning && (
              <p className={styles.warning}>날짜 정보를 입력하세요.</p>
          )}
        </form>
      </div>
  );
};

export default HotelSearchForm;
