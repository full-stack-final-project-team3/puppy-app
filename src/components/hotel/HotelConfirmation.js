import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import styles from './HotelConfirmation.module.scss';
import {useNavigate} from 'react-router-dom';
import {submitReservation, submitReservationWithKakaoPay} from '../store/hotel/ReservationSlice';
import dayjs from "dayjs";
import {userEditActions} from '../store/user/UserEditSlice';
import HotelModal from '../hotel/HotelModal';
import Footer from '../../layout/user/Footer';
import {resetHotels, setStep} from '../store/hotel/HotelPageSlice';
import {resetReservation} from '../store/hotel/ReservationSlice';
import {getUserToken} from "../../config/user/auth";

const HotelConfirmation = ({
                               hotel,
                               selectedRoom = {name: 'Default Room Name'},
                               startDate,
                               endDate,
                               totalPrice,
                               user = {realName: 'Guest', point: 0}
                           }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const personCount = useSelector(state => state.hotelPage.personCount);
    const email = user.email;
    const token = getUserToken();
    const [remainingPrice, setRemainingPrice] = useState(totalPrice);
    const [pointUsage, setPointUsage] = useState('');
    const [showPointPayment, setShowPointPayment] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isConfirmStep, setIsConfirmStep] = useState(true);

    const handleKakaoPayReady = () => {
        // Redux dispatch로 submitReservationWithKakaoPay 호출
        dispatch(submitReservationWithKakaoPay({
            hotelId: hotel['hotel-id'],
            roomId: selectedRoom['room-id'],
            startDate: startDate,
            endDate: endDate,
            userId: user.id,
            totalPrice: totalPrice,
            user: user,
            email: user.email,
            token: token,
            createdAt: dayjs().utc().format(),
            hotelName: hotel['hotel-name']
        }))
        .then(() => {
            console.log("카카오페이 결제가 완료되었습니다.");
        })
        .catch((error) => {
            console.error("카카오페이 결제 준비 실패:", error);
            setModalMessage("결제 준비 중 오류가 발생했습니다.");
            setShowModal(true);
        });
    };
    
    
    const handleConfirmBooking = () => {
        if (!user) {
            setModalMessage("사용자 정보가 없습니다.");
            setShowModal(true);
            return;
        }

        if (!token) {
            setModalMessage("로그인이 필요합니다.");
            setShowModal(true);
            navigate('/login');
            return;
        }

        if (remainingPrice === 0) {
            setModalMessage("예약을 진행하시겠습니까?");
            setShowModal(true);
            console.log('포인트 결제로 진행');
        } else {
            console.log('카카오페이 결제 진행');
            handleKakaoPayReady();
        }

        setModalMessage("예약을 진행하시겠습니까?");
        setShowModal(true);
    };

    const handleReservation = () => {
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
                setModalMessage("예약이 완료되었습니다.");
                setIsConfirmStep(false);
                setShowModal(true); // 예약 완료 후 모달을 표시
                const deletedPoint = user.point - totalPrice;
                dispatch(userEditActions.updateUserDetail({...user, point: deletedPoint}));
            })
            .catch((error) => {
                console.error('Reservation failed:', error);
                setModalMessage("포인트가 부족합니다..");
                setIsConfirmStep(false);
                setShowModal(true); // 예약 실패 시에도 모달을 표시
            });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (!isConfirmStep) {
            // 상태 초기화
            dispatch(resetHotels());
            dispatch(resetReservation());
            dispatch(setStep(1));

            // 예약 확인 페이지로 이동
            navigate('/hotel', {replace: true});
        }
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
        const options = {weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit'};
        return date.toLocaleDateString('en-US', options).replace(',', '').replace(/\//g, ' / ');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const handlePaymentMethodClick = (method) => {
        if (method === 'point') {
            setShowPointPayment(!showPointPayment);
        } else if (method === 'kakaoPay') {
            handleKakaoPayReady();
        } else {
            alert('추후 업데이트 예정입니다.');
        }
    };

    

    const isConfirmButtonDisabled = remainingPrice !== 0;

    return (
        <>
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
                    <button className={styles.paymentButton} onClick={() => handlePaymentMethodClick('bank')}>무통장입금
                    </button>
                    <button className={styles.paymentButton}
                            onClick={() => handlePaymentMethodClick('creditCard')}>신용카드
                    </button>
                    <button className={styles.paymentButton}
                            onClick={() => handlePaymentMethodClick('virtualAccount')}>가상계좌
                    </button>
                    <button className={styles.paymentButton}
                            onClick={() => handlePaymentMethodClick('accountTransfer')}>계좌이체
                    </button>
                    <button className={styles.paymentButton} 
                            onClick={() => handlePaymentMethodClick('kakaoPay')}>카카오페이
                    </button>
                    <button className={styles.paymentButton} 
                            onClick={() => handlePaymentMethodClick('point')}>포인트
                    </button>
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

                {showModal && (
                    <HotelModal
                        title={isConfirmStep ? "예약 확인" : "알림"}
                        message={modalMessage}
                        onConfirm={isConfirmStep ? handleReservation : handleCloseModal}
                        onClose={handleCloseModal}
                        confirmButtonText={isConfirmStep ? "예" : "확인"}
                        showCloseButton={isConfirmStep}
                    />
                )}
            </div>
            <Footer/>
        </>
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
