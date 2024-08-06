import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './HotelConfirmation.module.scss';
import { useNavigate } from 'react-router-dom';
import { submitReservation } from '../store/hotel/ReservationSlice';

const HotelConfirmation = ({
                               hotel,
                               selectedRoom = { name: 'Default Room Name' },
                               startDate,
                               endDate,
                               totalPrice,
                               user = { realName: 'Guest' }
                           }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const personCount = useSelector(state => state.hotelPage.personCount);
    const email = user.email;
    const token = JSON.parse(localStorage.getItem('userData')).token;


    const handleConfirmBooking = () => {
        if (!user) {
            alert("사용자 정보가 없습니다.");
            return;
        }

        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login'); // 로그인 페이지로 이동
            return;
        }

        dispatch(submitReservation({
            hotelId: hotel['hotel-id'],
            roomId: selectedRoom['room-id'],
            hotelName: hotel['hotel-name'],
            startDate,
            endDate,
            userId: user.id,
            totalPrice,
            user,
            email,
            token,
            createdAt: new Date().toISOString()
        }))
            .unwrap()
            .then((response) => {
                alert("예약이 완료되었습니다.");
                navigate('/');
            })
            .catch((error) => {
                console.error('Reservation failed:', error);
                alert("예약이 되어있는 객실입니다.");
            });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    return (
        <div className={styles.bookingConfirmation}>
            <h2>Booking Confirmation</h2>
            <p>Hotel: {hotel['hotel-name']}</p>
            <p>Room: {selectedRoom.room_name}</p>
            <div className={styles.priceDetails}>
                <span className={styles.priceLabel}>Total Price: </span>
                <span className={styles.priceValue}>{formatPrice(totalPrice)}</span>
            </div>
            <div className={styles.personCount}>
                <span>Person Count: {personCount}</span>
            </div>
            <div className={styles.dateDetails}>
                <p>Check-in Date: {formatDate(startDate)}</p>
                <p>Check-out Date: {formatDate(endDate)}</p>
            </div>
            <div className={styles.userInfo}>
                <p>User: {user.nickname}</p>
            </div>

            <div className={styles.userInfo}>
                <p>결제 정보</p>
                <p>객실 가격: {formatPrice(totalPrice)}</p>
                <p>할인/ 부가결제: {''}</p>
            </div>

            <div className={styles.userInfo}>
                <p>최종 결제 금액 : {formatPrice(totalPrice)}</p>
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
        name: PropTypes.string,
    }),
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    totalPrice: PropTypes.number.isRequired,
    user: PropTypes.shape({
        nickname: PropTypes.string, // Adjust according to actual user properties
    }),
};

export default HotelConfirmation;
