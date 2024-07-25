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
    const fetchHotels = async () => {
      try {
        const response = await fetch(HOTEL_URL, {
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

    fetchHotels();
  }, []);

  const handleNextStep = () => {
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (num) => {
    if (num === 1) {
      setStep(1);
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
      <div className={styles.stepContent}>
        {step === 1 && (
          <HotelSearchForm
            isAdmin={isAdmin}
            personCount={personCount}
            incrementPersonCount={incrementPersonCount}
            decrementPersonCount={decrementPersonCount}
            handleNextStep={handleNextStep}
          />
        )}
        {/* Add other step content here */}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <HotelList hotels={hotels} />
      )}
    </div>
  );
};

export default HotelPage;
