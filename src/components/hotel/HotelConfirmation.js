import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styles from './HotelConfirmation.module.scss';
import { useNavigate } from 'react-router-dom';
import { submitReservation } from '../store/hotel/ReservationSlice';
import dayjs from "dayjs";
import {userEditActions} from "../store/user/UserEditSlice";

const HotelConfirmation = ({
    hotel,
    selectedRoom = { name: 'Default Room Name' },
    startDate,
    endDate,
    totalPrice,
    user = { realName: 'Guest', point: 0 }
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const personCount = useSelector(state => state.hotelPage.personCount);
    const email = user.email;
    const token = JSON.parse(localStorage.getItem('userData')).token;
    const [remainingPrice, setRemainingPrice] = useState(totalPrice);
    const [pointUsage, setPointUsage] = useState('');
    const [showPointPayment, setShowPointPayment] = useState(false);


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
            startDate: dayjs(startDate).utc().format(),
            endDate: dayjs(endDate).utc().format(),
            userId: user.id,
            totalPrice: totalPrice,
            user,
            email,
            token,
            createdAt: dayjs().utc().format()
        }))
            .unwrap()

            .then((response) => {
                alert("예약이 완료되었습니다.");
                const deletedPoint = user.point - totalPrice;
                dispatch(userEditActions.updateUserDetail({ ...user, point: deletedPoint }));
                window.location.reload();
            })
            .catch((error) => {
                console.error('Reservation failed:', error);
                alert("예약이 되어있는 객실입니다.");
            });
    };

    const handleUseAllPoints = () => {
        const pointsToUse = Math.min(user.point, totalPrice);
        setPointUsage(pointsToUse);
        setRemainingPrice(Math.max(0, totalPrice - pointsToUse));
    };

    const handlePointChange = (e) => {
        let points = parseInt(e.target.value, 10) || 0;
        points = Math.min(user.point, points);
        points = Math.min(totalPrice, points);
        setPointUsage(points);
        setRemainingPrice(Math.max(0, totalPrice - points));
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const handlePaymentMethodClick = (method) => {
        if (method === 'point') {
            setShowPointPayment(!showPointPayment);
        } else {
            alert('추후 업데이트 예정입니다.');
        }
    };

    const isConfirmButtonDisabled = remainingPrice !== 0;

    return (
        <div className={styles.bookingConfirmation}>
            <h2 className={styles.bookingTitle}>결제 확인</h2>
            <p>Hotel: {hotel['hotel-name']}</p>
            <p>Room: {selectedRoom.room_name}</p>
            <div className={styles.section}>
                <span className={styles.sectionLabel}>Dog Count: {personCount}</span>
            </div>
            <div className={styles.section}>
                <p>Check-in Date: {formatDate(startDate)}</p>
                <p>Check-out Date: {formatDate(endDate)}</p>
            </div>
            <div className={styles.section}>
                <p>User: {user.nickname}</p>
                <p>Phone Number: {user.phoneNumber}</p>
            </div>

            <div className={styles.paymentInfoBox}>
                <h3 className={styles.sectionTitle}>결제 정보</h3>
                <p>객실 가격: {formatPrice(totalPrice)}</p>
                <p>포인트 결제 차감: <span className={styles.discountAmount}>-{formatPrice(pointUsage)}</span></p>
                <p>최종 결제 금액: {formatPrice(totalPrice)}</p>
            </div>

            <div className={styles.paymentMethods}>
                <h3 className={styles.sectionTitle}>결제수단</h3>
                <button className={styles.paymentButton} onClick={() => handlePaymentMethodClick('bank')}>무통장입금</button>
                <button className={styles.paymentButton} onClick={() => handlePaymentMethodClick('creditCard')}>신용카드</button>
                <button className={styles.paymentButton} onClick={() => handlePaymentMethodClick('virtualAccount')}>가상계좌</button>
                <button className={styles.paymentButton} onClick={() => handlePaymentMethodClick('accountTransfer')}>계좌이체</button>
                <button className={styles.paymentButton} onClick={() => handlePaymentMethodClick('point')}>포인트</button>
            </div>

            {showPointPayment && (
                <div className={styles.pointPayment}>
                    <h3 className={styles.sectionTitle}>포인트 결제</h3>
                    <input
                        type="number"
                        value={pointUsage}
                        onChange={handlePointChange}
                        placeholder="포인트 사용"
                        className={styles.inputBox}
                        max={totalPrice}
                    />
                    <button className={styles.useAllPointsButton} onClick={handleUseAllPoints}>모두사용</button>
                    <p className={styles.pointPaymentMessage}>사용 가능: {formatPrice(user.point - pointUsage)}p</p>
                </div>
            )}

            <button
                className={`${styles.confirmButton} ${isConfirmButtonDisabled ? styles.disabledButton : styles.enabledButton}`}
                onClick={handleConfirmBooking}
                disabled={isConfirmButtonDisabled}
            >
                Confirm Booking
            </button>
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
        nickname: PropTypes.string,
        point: PropTypes.number,
    }),
};

export default HotelConfirmation;
