import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import styles from './BookingDetail.module.scss';
import { useSelector } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const BookingDetail = ({ hotel, startDate, endDate, onPay }) => {
    const [roomCount, setRoomCount] = React.useState(1);
    const personCount = useSelector(state => state.reservation.personCount);
    const selectedRoom = useSelector(state => state.hotelPage.selectedRoom);
    const navigate = useNavigate();

    const handleModifyRoom = () => {
        navigate(`/modify-room/${selectedRoom['room-id']}`, { state: { hotel, room: selectedRoom } });
    };

    if (!hotel) {
        console.log('No hotel data available');
        return <p>No hotel selected</p>;
    }

    if (!hotel.room || hotel.room.length === 0) {
        console.log('No room data available');
        return <p>No rooms available</p>;
    }

    if (!selectedRoom) {
        console.log('No selected room data available');
        return <p>No selected room available</p>;
    }

    const translateType = (type) => {
        switch (type) {
            case 'SMALL_DOG':
                return '소형견';
            case 'MEDIUM_DOG':
                return '중형견';
            case 'LARGE_DOG':
                return '대형견';
            default:
                return '객실 선택에 오류가 있습니다.';
        }
    };

    const handleIncrement = () => setRoomCount(roomCount + 1);
    const handleDecrement = () => setRoomCount(Math.max(1, roomCount - 1));

    const roomPrice = selectedRoom['room-price'] || 0;
    const finalPersonCount = personCount || 1;
    const totalPrice = roomPrice * roomCount * finalPersonCount;

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    const firstImageUrl = selectedRoom['room-images'] && selectedRoom['room-images'][0]
        ? getImageUrl(selectedRoom['room-images'][0]['hotelImgUri'])
        : '';

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    return (
        <>
            <button onClick={handleModifyRoom}>객실 수정하기</button>
            <div className={styles.bookingDetail}>
                <div className={styles.roomImages}>
                    {firstImageUrl && (
                        <div className={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Room image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                }}
                                className={styles.sliderImage}
                            />
                        </div>
                    )}
                </div>
                <h2>Title: {hotel['hotel-name']}</h2>
                <p>Room Type: {translateType(selectedRoom['room-type'])}</p>
                <p>Price: {selectedRoom['room-price']}</p>
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
                    <span className={styles.priceValue}>{formatPrice(totalPrice)}</span>
                </div>
                <div className={styles.policies}>
                    <p className={`${styles.policy} ${styles.rulesPolicy}`}>Rules Policy: {hotel['rules-policy']}</p>
                    <p className={`${styles.policy} ${styles.cancelPolicy}`}>Cancel Policy: {hotel['cancel-policy']}</p>
                </div>
                <button onClick={() => onPay(hotel, selectedRoom, totalPrice)}>Book Now</button>
            </div>
        </>
    );
};

BookingDetail.propTypes = {
    hotel: PropTypes.object.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    onPay: PropTypes.func.isRequired,
};

export default BookingDetail;
