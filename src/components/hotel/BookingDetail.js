import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import styles from './BookingDetail.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {useNavigate} from "react-router-dom";
import {setTotalPrice} from "../store/hotel/ReservationSlice";
import Footer from '../../layout/user/Footer';
import {AUTH_URL} from "../../config/user/host-config"

const BookingDetail = ({ hotel, startDate, endDate, onPay }) => {
    const [roomCount, setRoomCount] = React.useState(1);
    const personCount = useSelector(state => state.reservation.personCount);
    const selectedRoom = useSelector(state => state.hotelPage.selectedRoom);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.userEdit.userDetail);
    const isAdmin =userData && userData.role === 'ADMIN';
    const roomPrice = selectedRoom ? selectedRoom['room-price'] || 0 : 0;
    const finalPersonCount = personCount || 1;

    const checkInDate = new Date(startDate);
    const checkOutDate = new Date(endDate);
    const stayDuration = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    const totalPrice = roomPrice * roomCount * finalPersonCount * stayDuration;

    // 리덕스 상태에 totalPrice 저장
    useEffect(() => {
        dispatch(setTotalPrice(totalPrice));
    }, [totalPrice, dispatch]);

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



    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `${AUTH_URL}${imageUri.replace('/local', '/hotel/images')}`;
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

    const animateProps = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false },
        transition: { ease: "easeInOut", duration: 1, y: { duration: 0.5 } }
    };


    return (
        <>
            {isAdmin && (<button className={styles.modifyButton} onClick={handleModifyRoom}>
                Modify Room
            </button>)}
            <div className={styles.bookingDetail}>
                <div className={styles.topDetail}>
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
                    <div className={styles.instruction}>
                        <h2>{hotel['hotel-name']}</h2>
                        <p>Room Type:  {translateType(selectedRoom['room-type'])}</p>
                        <p>Price:  {selectedRoom['room-price']}</p>
                        <p>Location:  {hotel['location']}</p>
                        <p className={styles.date}>Date:  {formatDate(startDate)} - {formatDate(endDate)}</p>
                        <div className={styles.roomCount}>
                            <button onClick={handleDecrement}>-</button>
                            <span>{roomCount}</span>
                            <button onClick={handleIncrement}>+</button>
                        </div>
                        <div className={styles.priceDetails}>
                            <span className={styles.priceLabel}>Total Price: </span>
                            <span className={styles.priceValue}>{formatPrice(totalPrice)} 원</span>
                        </div>
                        <button className={styles.bookNow} onClick={() => onPay(hotel, selectedRoom, totalPrice)}>Book Now</button>
                    </div>
                </div>

                <motion.div {...animateProps} className={styles.policies}>
                    <p className={`${styles.policy} ${styles.rulesPolicy}`}>Rules Policy: {hotel['rules-policy']}</p>
                    <p className={`${styles.policy} ${styles.cancelPolicy}`}>Cancel Policy: {hotel['cancel-policy']}</p>
                </motion.div>
            </div>
            <Footer />
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