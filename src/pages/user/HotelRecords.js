import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReservation, fetchUserReservations } from "../../components/store/hotel/ReservationSlice";
import { fetchReviews } from "../../components/store/hotel/HotelReviewSlice";
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import { Link, useNavigate } from 'react-router-dom';
import styles from './HotelRecords.module.scss';
import HotelModal from '../../components/hotel/HotelModal';
import {AUTH_URL} from "../../config/user/host-config";
import {userDataLoader} from "../../config/user/auth";
import Footer from '../../layout/user/Footer';


const HotelRecords = () => {
    const dispatch = useDispatch();
    const { userReservations, status, error } = useSelector(state => state.reservation);
    const { reviewsByReservationId } = useSelector(state => state.reviews);
    const userData = userDataLoader();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const navigate = useNavigate();
    const userId = userData.userId;

    const [showModal, setShowModal] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState(null);

    // 사용자의 예약내역조회
    useEffect(() => {
        dispatch(fetchUserReservations({ userId }));
    }, [dispatch, userId]);

    // 사용자가 예약한 내역이 존재하면 리뷰정보를 가져오기.
    useEffect(() => {
        const fetchAllReviews = async () => {
            if (userReservations.length > 0) {
                for (const reservation of userReservations) {
                    await dispatch(fetchReviews(reservation.reservationId)).unwrap();
                }
            }
        };
        fetchAllReviews();
    }, [dispatch, userReservations]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `${AUTH_URL}${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    const hasUserReviewed = (reservationId) => {
        const reviews = reviewsByReservationId[reservationId] || [];
        return reviews.some(review => review.userId === userData.userId); // userId로 수정
    };

    const handleDeleteReservation = async () => {
        try {
            await dispatch(deleteReservation(selectedReservationId));
            alert("예약이 삭제되었습니다.");
            setShowModal(false);
            setSelectedReservationId(null);
        } catch (error) {
            console.error("예약 삭제 실패:", error);
            alert("예약 삭제에 실패했습니다.");
        }
    };

    const confirmDeleteReservation = (reservationId) => {
        setSelectedReservationId(reservationId);
        setShowModal(true);
    };

    const handleAddReview = async (hotelId, reservationId) => {
        if (userDetail && userDetail.id) {
            navigate(`/add-review/${hotelId}/${reservationId}`, {
                state: { from: `/hotel-records` }
            });
        } else {
            console.error('사용자 ID가 누락되었습니다');
        }
    };

    const isReviewable = (reservationEndAt) => {
        const today = new Date();
        const endDate = new Date(reservationEndAt);
        return endDate < today;
    };

    const isCancelable = (reservationStartAt) => {
        const today = new Date();
        const startDate = new Date(reservationStartAt);
        return startDate >= today;
    };

    useEffect(() => {
        if (selectedReservationId) {
            dispatch(fetchReviews(selectedReservationId));
        }
    }, [selectedReservationId, dispatch]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <>
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h1 className={styles.title}>호텔 예약 내역</h1>
                {userReservations.length === 0 ? (
                    <p className={styles.noReservation}>예약 내역이 없습니다.</p>
                ) : (
                    <ul className={styles.reservationList}>
                        {userReservations.map(reservation => {
                            const hotel = reservation.hotel;
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
                                        <div><strong>주문 총액 :</strong> {formatPrice(reservation.price)}</div>
                                        <div><strong>호텔 위치 :</strong> {reservation.hotel.location}</div>
                                        <div><strong>예약날짜 :</strong> {new Date(reservation.reservationAt).toLocaleDateString()}</div>
                                        <div><strong>예약 종료 날짜:</strong> {new Date(reservation.reservationEndAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className={styles.reservationActions}>
                                        <Link
                                            to={`/detail-reservation`}
                                            state={{
                                                hotel,
                                                roomName: reservation.room.room_name,
                                                totalPrice: reservation.price,
                                                reservationDate: reservation.reservationAt,
                                                reservationEndDate: reservation.reservationEndAt,
                                                hotelImage: firstImageUrl
                                            }}
                                            className={styles.link}
                                        >
                                            상세조회
                                        </Link>
                                        {isCancelable(reservation.reservationAt) && (
                                            <button
                                                onClick={() => confirmDeleteReservation(reservation.reservationId)}
                                                className={styles.link}
                                            >
                                                예약취소
                                            </button>
                                        )}
                                        {isReviewable(reservation.reservationEndAt) && !hasUserReviewed(reservation.reservationId) && (
                                            <button
                                                onClick={() => handleAddReview(reservation.hotelId, reservation.reservationId)}
                                                className={styles.link}
                                            >
                                                리뷰 작성
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {showModal && (
                <HotelModal
                    title="예약 취소 확인"
                    message="정말로 이 예약을 취소하시겠습니까?"
                    onConfirm={handleDeleteReservation}
                    onClose={() => setShowModal(false)}
                    confirmButtonText="예"
                    showCloseButton={true}
                />
            )}
        </div>

        <Footer />
        </>
    );
};

export default HotelRecords;
