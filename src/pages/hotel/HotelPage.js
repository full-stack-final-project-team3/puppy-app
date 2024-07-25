// src/pages/hotel/HotelPage.js
import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { HOTEL_URL } from '../../config/user/host-config';
import StepIndicator from '../../components/hotel/StepIndicator';
import PersonCount from '../../components/hotel/PersonCount';
import HotelList from '../../components/hotel/HotelList';
import HotelSearchForm from '../../components/hotel/HotelSearchForm';
import styles from './HotelPage.module.scss';

const HotelPage = () => {
  const userData = useLoaderData();
  const isAdmin = userData && userData.role === 'ADMIN';
  const [hotels, setHotels] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personCount, setPersonCount] = useState(1);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (location = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${HOTEL_URL}?location=${location}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await response.json();
      setHotels(data.hotels);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (location) => {
    fetchHotels(location);
  };

  const handleNextStep = () => {
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (num) => {
    if (num === 1) {
      setStep(1);
      setHotels([]);
    }
  };

  const incrementPersonCount = () => {
    setPersonCount(prevCount => prevCount + 1);
  };

  const decrementPersonCount = () => {
    setPersonCount(prevCount => Math.max(1, prevCount - 1));
  };

  return (
    <div className={styles.hotelReservationPage}>
      <StepIndicator step={step} onStepClick={handleStepClick} />
      {step === 1 ? (
        <div className={styles.stepContent}>
          <HotelSearchForm
            isAdmin={isAdmin}
            personCount={personCount}
            incrementPersonCount={incrementPersonCount}
            decrementPersonCount={decrementPersonCount}
            handleNextStep={handleNextStep}
            onSearch={handleSearch}
          />
        </div>
      ) : (
        <div className={styles.hotelListContainer}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <HotelList hotels={hotels} />
          )}
        </div>
      )}
    </div>
  );
};

export default HotelPage;
