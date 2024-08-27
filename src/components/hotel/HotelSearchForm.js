import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './HotelSearchForm.module.scss';
import DualDatePickers from './Hoteldates';
import {
  setSelectedCity,
  setStartDate,
  setEndDate,
  setShowWarning,
  setPersonCount
} from '../../components/store/hotel/ReservationSlice';
import dayjs from 'dayjs';


const cities = ["서울", "부산", "인천", "대구", "대전", "광주", "수원", "울산", "고양", "용인", "경기"];

const HotelSearchForm = ({ isAdmin, handleNextStep, onSearch }) => {
  const dispatch = useDispatch();
  const { selectedCity, startDate, endDate, showWarning } = useSelector((state) => state.reservation);
  
  useEffect(() => {
    // Set default person count to 1
    dispatch(setPersonCount(1));
}, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedCity || !startDate || !endDate) {
      dispatch(setShowWarning(true));
    } else {
      dispatch(setShowWarning(false));
      onSearch(selectedCity);
      handleNextStep();
    }
  };

  useEffect(() => {
    if (selectedCity && startDate && endDate) {
      dispatch(setShowWarning(false));
    }
  }, [selectedCity, startDate, endDate, dispatch]);


  return (
    <>
      <div className={styles.stepContent}>
        {isAdmin && (
            <div className={styles.addHotelButtonContainer}>
              <button className={styles.addHotelButton}>
                <Link to="/add-hotel">호텔 추가</Link>
              </button>
            </div>
        )}
        <form onSubmit={handleSearch}>
          <label className={styles.location}>
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
          <button className={styles.next} type="submit">Search</button>
          {showWarning && (
              <p className={styles.warning}>
                {(!selectedCity && !startDate && !endDate) ? '지역 정보와 날짜 정보를 모두 입력하세요.' : (!selectedCity ? '지역 정보를 선택하세요.' : '날짜 정보를 입력하세요.')}
              </p>
          )}
        </form>
      </div>
      </>
  );
};

export default HotelSearchForm;
