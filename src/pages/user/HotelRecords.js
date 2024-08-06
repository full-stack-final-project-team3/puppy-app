import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReservations } from "../../components/store/hotel/ReservationSlice";
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";

const UserReservations = () => {
    const dispatch = useDispatch();
    const { userReservations, status, error } = useSelector(state => state.reservation);
    const userId = JSON.parse(localStorage.getItem('userData')).userId;
    const totalPrice = useSelector(state => state.reservation.totalPrice)

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

    return (
        <div>
            <MyPageHeader />
            <h1>My Reservations</h1>
            {userReservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <ul>
                    {userReservations.map(reservation => {
                        const hotelImages = reservation.hotel["hotel-images"];
                        const firstImageUrl = hotelImages && hotelImages[0]
                            ? getImageUrl(hotelImages[0].hotelImgUri)
                            : '';

                        return (
                            <li key={reservation.reservationId}>
                                {firstImageUrl && (
                                    <div>
                                        <img
                                            src={firstImageUrl}
                                            alt={`${reservation.hotel['hotel-name']} 이미지`}
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                    </div>
                                )}
                                <div>
                                    <strong>호텔 이름 :</strong> {reservation.hotel['hotel-name']}
                                </div>
                                <div>
                                    <strong>객실 이름 :</strong> {reservation.room.room_name}
                                </div>
                                <div>
                                    <strong>주문 총액 :</strong> {formatPrice(totalPrice)}
                                </div>
                                <div>
                                    <strong>호텔 위치 :</strong> {reservation.hotel.location}
                                </div>
                                <div>
                                    <strong>예약날짜 :</strong> {new Date(reservation.reservationAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>예약 종료 날짜:</strong> {new Date(reservation.reservationEndAt).toLocaleDateString()}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default UserReservations;
