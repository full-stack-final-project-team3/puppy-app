

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';  
import styles from './BookingDetail.module.scss';
import { useSelector } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BookingDetail = ({ hotel, selectedRoom, startDate, endDate, onPay }) => {
  const [roomCount, setRoomCount] = React.useState(1);
  const personCount = useSelector(state => state.reservation.personCount)


  if (!hotel) {
    console.log('No hotel data available');
    return <p>No hotel selected</p>;
  }

  if (!hotel.room || hotel.room.length === 0) {
    console.log('No room data available');
    return <p>No rooms available</p>;
  }
  
  // 타입을 변환하는 함수
  const translateType = (type) => {
    switch (type) {
      case 'SMALL_DOG':
        return '소형견'
      case 'MEDIUM_DOG':
        return '중형견'
      case 'LARGE_DOG':
        return '대형견';
      default:
        return '객실 선택에 오류가 있습니다. ';
    }
  };

  // 룸 카운트 계산
  const handleIncrement = () => setRoomCount(roomCount + 1);
  const handleDecrement = () => setRoomCount(Math.max(1, roomCount - 1));

  // 총 금액 계산
  const totalPrice = selectedRoom.price * roomCount * personCount;

  // 이미지 불러오기
  const getImageUrl = (imageUri) => {
    if (imageUri && imageUri.startsWith('/local/')) {
      return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
    }
    return imageUri;
  };

  // 첫번째 이미지만 불러오기
  const firstImageUrl = selectedRoom['room-images'] && selectedRoom['room-images'][0] 
    ? getImageUrl(selectedRoom['room-images'][0]['hotelImgUri'])
    : '';

  // 날짜 포맷 수정
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'short' , year: 'numeric', month: '2-digit', day: '2-digit'};
    return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
  };

  // 슬라이드 셋팅
  const sliderSettings = {
    dots: true,
    infinite: true,  // 무한 스크롤 가능하도록 설정
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return  (
    <div className={styles.bookingDetail}>
      <div className={styles.roomImages}>
        {firstImageUrl && (
          <div className={styles.imageContainer}>
            <img 
              src={firstImageUrl} 
              alt="Room image" 
              onLoad={() => console.log('Image loaded successfully')}
              onError={(e) => {
                e.target.onerror = null;
                console.log('Image load error');
              }}
              className={styles.sliderImage}
            />
          </div>
        )}
      </div>
      <h2>Title: {hotel['hotel-name']}</h2>
      <p>Room Type: {translateType(selectedRoom.type)}</p>
      <p>Price: {selectedRoom.price}</p>
      <p>Location: {hotel['location']}</p>
      <p>Date: {formatDate(startDate)} - {formatDate(endDate)}</p>
      <div className={styles.roomCount}>
        <button onClick={handleDecrement}>-</button>
        <span>{roomCount}</span>
        <button onClick={handleIncrement}>+</button>
      </div>
      <span className={styles.priceLabel}>Selected Dog Count: {personCount}</span>
      <div className={styles.priceDetails}>
        <span className={styles.priceLabel}>Total Price: </span>
        <span className={styles.priceValue}>{totalPrice}</span>
      </div>
      <div className={styles.policies}>
        <p className={`${styles.policy} ${styles.rulesPolicy}`}>Rules Policy: {hotel['rules-policy']}</p>
        <p className={`${styles.policy} ${styles.cancelPolicy}`}>Cancel Policy: {hotel['cancel-policy']}</p>
      </div>
      <button onClick={() => onPay(hotel, selectedRoom, totalPrice )}>Book Now</button>
    </div>
  );
};

BookingDetail.propTypes = {
  hotel: PropTypes.object.isRequired,
  personCount: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default BookingDetail;

