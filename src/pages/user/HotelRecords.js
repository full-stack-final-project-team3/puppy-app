import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReservations } from "../../components/store/hotel/ReservationSlice";
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import { Link } from 'react-router-dom';
import styles from './HotelRecords.module.scss';

const HotelRecords = () => {
    const dispatch = useDispatch();
    const { userReservations, status, error } = useSelector(state => state.reservation);
    const userId = JSON.parse(localStorage.getItem('userData')).userId;
    const totalPrice = useSelector(state => state.reservation.totalPrice);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserReservations({ userId }));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        console.log('User Reservations:', userReservations);
    }, [userReservations]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    console.log(userReservations);

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h1 className={styles.title}>My Reservations</h1>
                {userReservations.length === 0 ? (
                    <p>No reservations found.</p>
                ) : (
                    <ul className={styles.reservationList}>
                        {userReservations.map(reservation => {
                            const hotelImages = reservation.hotel["hotel-images"];
                            const firstImageUrl = hotelImages && hotelImages[0]
                                ? getImageUrl(hotelImages[0].hotelImgUri)
                                : '';

                            return (
                                <li key={reservation.reservationId} className={styles.reservationItem}>
                                    {firstImageUrl && (
                                        <div className={styles.imageContainer}>
                                            <img
                                                src={firstImageUrl}
                                                alt={`${reservation.hotel['hotel-name']} 이미지`}
                                                className={styles.reservationImage}
                                            />
                                        </div>
                                    )}
                                    <div className={styles.reservationDetails}>
                                        <div><strong>호텔 이름 :</strong> {reservation.hotel['hotel-name']}</div>
                                        <div><strong>객실 이름 :</strong> {reservation.room.room_name}</div>
                                        <div><strong>주문 총액 :</strong> {formatPrice(totalPrice)}</div>
                                        <div><strong>호텔 위치 :</strong> {reservation.hotel.location}</div>
                                        <div><strong>예약날짜 :</strong> {new Date(reservation.reservationAt).toLocaleDateString()}</div>
                                        <div><strong>예약 종료 날짜:</strong> {new Date(reservation.reservationEndAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className={styles.reservationActions}>
                                        <Link to={`/detail-reservation`} className={styles.link}>
                                            상세조회
                                        </Link>
                                        <Link to={`/`} className={styles.link}>
                                            예약취소
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HotelRecords;