import React, { useRef, useEffect, useState, useMemo } from 'react'; // useState 추가
import { useLoaderData } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHotels,
  setStep,
  incrementPersonCount,
  decrementPersonCount,
  resetHotels,
  fetchHotelDetails,
  setTotalPrice
} from '../../components/store/hotel/HotelPageSlice';
import StepIndicator from '../../components/hotel/StepIndicator';
import HotelList from '../../components/hotel/HotelList';
import HotelSearchForm from '../../components/hotel/HotelSearchForm';
import RoomDetail from '../../components/hotel/RoomDetail';
import BookingDetail from '../../components/hotel/BookingDetail';
import HotelConfirmation from '../../components/hotel/HotelConfirmation';
import styles from './HotelPage.module.scss';
import './HotelPageAnimations.scss';
import dayjs from 'dayjs';

const HotelPage = () => {
  const userData = useLoaderData();
  const isAdmin = userData && userData.role === 'ADMIN';

  const dispatch = useDispatch();
  const { hotels, step, loading, error, personCount, selectedHotel, selectedRooms, totalPrice } = useSelector(state => state.hotelPage);
  const startDate = useSelector(state => state.reservation.startDate);
  const endDate = useSelector(state => state.reservation.endDate);
  const user = useSelector(state => state.userEdit.userDetail);
  console.log(user)

  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    if (hotels && hotels.length > 0) {
      console.log('Hotels:', hotels);
    }
  }, [hotels]);

  useEffect(() => {
    console.log('Selected Hotel:', selectedHotel);
  }, [selectedHotel]);

  useEffect(() => {
    console.log('Selected Room: ', selectedRooms);
  }, [selectedRooms]);

  const formatDate = (date) => {
    return dayjs(date).format('YYYY / MM / DD ddd'); // 날짜를 원하는 형식으로 변환합니다.
  };

  const backgroundImages = [
    'url(https://www.zooplus.co.uk/magazine/wp-content/uploads/2018/03/dachshund.jpg)', // Step 1
    'url(https://example.com/image2.jpg)', // Step 2
    'url(https://example.com/image3.jpg)', // Step 3
    'url(https://example.com/image4.jpg)', // Step 4
    'url(https://example.com/image5.jpg)'  // Step 5
  ];


  const sliderSettings = useMemo(() => ({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    cssEase: 'linear'
  }), []);

  const handleSearch = (location) => {
    dispatch(fetchHotels(location));
  };

  const handleNextStep = () => {
    dispatch(setStep(Math.min(step + 1, 5)));
  };

  const handlePreviousStep = () => {
    dispatch(setStep(Math.max(step - 1, 1)));
  };

  const handleStepClick = (num) => {
    if (num < step) {
      dispatch(setStep(num));
      if (num === 1) {
        dispatch(resetHotels());
      }
    }
  };

  const handleShowProperty = (hotelId) => {
    dispatch(fetchHotelDetails(hotelId)).then(() => {
      dispatch(setStep(3));
    });
  };

  const handleBook = (hotel, room) => {
    setSelectedRoom(room); // 선택된 방 정보를 상태에 저장
    dispatch(fetchHotelDetails(hotel.id)).then(() => {
      dispatch(setStep(4));
    });
  };

  const handlePayment = (hotel, room, totalPrice) => {
    setSelectedRoom(room); // 선택된 방 정보를 상태에 저장
    dispatch(setTotalPrice(totalPrice));
    dispatch(fetchHotelDetails(hotel.id)).then(() => {
      dispatch(setStep(5));
    });
  };


  const nodeRef = useRef(null);

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
          nodeRef={nodeRef}
        >
          <div ref={nodeRef} className={styles.page}>
            {step === 1 ? (
              <div className={styles.stepContent}>
                <HotelSearchForm
                  isAdmin={isAdmin}
                  personCount={personCount}
                  incrementPersonCount={() => dispatch(incrementPersonCount())}
                  decrementPersonCount={() => dispatch(decrementPersonCount())}
                  handleNextStep={handleNextStep}
                  onSearch={handleSearch}
                />
              </div>
            ) : step === 2 ? (
              <div className={styles.hotelListContainer}>
                <button
                  className={styles.dateButton}
                  onClick={() => handleStepClick(1)}
                >
                  {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                </button>
                {loading ? (
                  <p>Loading…</p>
                ) : error ? (
                  <p>Error: {error}</p>
                ) : (
                  <HotelList 
                  hotels={hotels} 
                  onShowProperty={handleShowProperty} />
                )}
                <button onClick={handlePreviousStep}>뒤로가기</button>
              </div>
            ) : step === 3 ? (
              <div className={styles.hotelDetailContainer}>
                <button
                  className={styles.dateButton}
                  onClick={() => handleStepClick(2)}
                >
                  {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                </button>
                {selectedHotel ? (
                  <RoomDetail 
                  hotel={selectedHotel} 
                  onBook={handleBook}
                  sliderSettings={sliderSettings}
                  />
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            ) : step === 4 ? ( // Step 4 추가
              <BookingDetail 
                hotel={selectedHotel} 
                selectedRoom={selectedRoom} 
                personCount={personCount} 
                startDate={startDate} 
                endDate={endDate}
                sliderSettings={sliderSettings}
                onPay={handlePayment}
                user={user}
              />
            ) : step === 5 ? ( // Step 5 추가
              <HotelConfirmation 
                hotel={selectedHotel} 
                selectedRoom={selectedRoom} 
                startDate={startDate} 
                endDate={endDate}
                totalPrice={totalPrice}
                user={user}
              />
            ) : null}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default HotelPage;
