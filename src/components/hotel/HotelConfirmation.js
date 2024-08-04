import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './HotelConfirmation.module.scss';
import { useNavigate } from 'react-router-dom';
import { submitReservation } from '../store/hotel/HotelReservationSlice';

const HotelConfirmation = ({ hotel, selectedRoom, startDate, endDate, totalPrice, user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const personCount = useSelector(state => state.hotelPage.personCount);
    console.log('user: ', user);

    const handleConfirmBooking = () => {
        dispatch(submitReservation({
            hotelId: hotel['hotel-id'],
            roomId: selectedRoom['room-id'],
            startDate,
            endDate,
            userId: user.userId,
            totalPrice
        }))
            .unwrap()
            .then((response) => {
                console.log('Reservation succeeded:', response);
                // 성공 시 예약 완료 페이지로 이동
                navigate('/hotel', { state: { reservation: response } });
                alert("예약이 완료되었습니다.")
            })
            .catch((error) => {
                console.error('Reservation failed:', error);
                alert("예약이 되어있는 객실입니다.")
            });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
    };

    return (
        <div className={styles.bookingConfirmation}>
            <h2>Booking Confirmation</h2>
            <p>Hotel: {hotel['hotel-name']}</p>
            <p>Room: {selectedRoom.name}</p>
            <div className={styles.priceDetails}>
                <span className={styles.priceLabel}>Total Price: </span>
                <span className={styles.priceValue}>{totalPrice}</span>
            </div>
            <div className={styles.personCount}>
                <span>Person Count: {personCount}</span>
            </div>
            <div className={styles.dateDetails}>
                <p>Check-in Date: {formatDate(startDate)}</p>
                <p>Check-out Date: {formatDate(endDate)}</p>
            </div>
            <div className={styles.userInfo}>
                <p>User: {user.realName}</p> {/* Assuming user object has a realName property */}
            </div>
            <button onClick={handleConfirmBooking}>Confirm Booking</button>
        </div>
    );
};

HotelConfirmation.propTypes = {
    hotel: PropTypes.shape({
        'hotel-name': PropTypes.string.isRequired,
    }).isRequired,
    selectedRoom: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    user: PropTypes.shape({
        realName: PropTypes.string.isRequired, // Adjust according to actual user properties
    }).isRequired,
};

export default HotelConfirmation;
