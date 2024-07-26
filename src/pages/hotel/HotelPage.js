// src/pages/hotel/HotelPage.js
import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { HOTEL_URL } from '../../config/user/host-config';
import StepIndicator from '../../components/hotel/StepIndicator';
import HotelList from '../../components/hotel/HotelList';
import HotelSearchForm from '../../components/hotel/HotelSearchForm';
import styles from './HotelPage.module.scss';
import './HotelPageAnimations.scss'; // 애니메이션 CSS 파일

const HotelPage = () => {
  const userData = useLoaderData();
  const isAdmin = userData && userData.role === 'ADMIN';
  const [hotels, setHotels] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personCount, setPersonCount] = useState(1);

  const backgroundImages = [
    'url(https://www.zooplus.co.uk/magazine/wp-content/uploads/2018/03/dachshund.jpg)', // Step 1
    'url(https://example.com/image2.jpg)', // Step 2
    'url(https://example.com/image3.jpg)', // Step 3
    'url(https://example.com/image4.jpg)', // Step 4
    'url(https://example.com/image5.jpg)'  // Step 5
  ];

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
      setStep(2); // 검색 완료 후 step을 2로 설정
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
    setStep(num);
    if (num === 1) {
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
      <div
          className={styles.hotelReservationPage}
          style={{ backgroundImage: backgroundImages[step - 1] }}
      >
        <StepIndicator step={step} onStepClick={handleStepClick} />
        <TransitionGroup>
          <CSSTransition
              key={step}
              timeout={300}
              classNames="page"
          >
            <div className={styles.page}>
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
              ) : step === 2 ? (
                  <div className={styles.hotelListContainer}>
                    {loading ? (
                        <p>Loading…</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <HotelList hotels={hotels} />
                    )}
                    <button onClick={handlePreviousStep}>뒤로가기</button>
                  </div>
              ) : null /* 다른 단계에 대한 컴포넌트를 추가할 수 있습니다. */
              }
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
  );
};

export default HotelPage;
