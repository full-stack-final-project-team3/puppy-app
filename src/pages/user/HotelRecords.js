import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {deleteReservation, fetchUserReservations} from "../../components/store/hotel/ReservationSlice";
import {fetchReviews} from "../../components/store/hotel/HotelReviewSlice"; // fetchReviews 가져오기
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import {Link, useNavigate} from 'react-router-dom';
import styles from './HotelRecords.module.scss';

const HotelRecords = () => {
    const dispatch = useDispatch();
    const {userReservations, status, error} = useSelector(state => state.reservation);
    // const {reviews} = useSelector(state => state.reviews);
    const { reviewsByReservationId } = useSelector(state => state.reviews);
    const userId = JSON.parse(localStorage.getItem('userData')).userId;
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const navigate = useNavigate();

    // 사용자의 예약내역조회
    useEffect(() => {
        dispatch(fetchUserReservations({userId}));
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

    console.log("userReservations", userReservations)

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    // 총액 1000 자리마다 , 찍어주기
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    // 이미지 가져오는 메서드
    const getImageUrl = (imageUri) => {
        if (imageUri && imageUri.startsWith('/local/')) {
            return `http://localhost:8888${imageUri.replace('/local', '/hotel/images')}`;
        }
        return imageUri;
    };

    // 사용자가 특정 호텔에 이미 리뷰를 작성했는지 확인하는 함수
    const hasUserReviewed = (reservationId) => {
        const reviews = reviewsByReservationId[reservationId] || [];
        return reviews.some(review => review.userId === userId);
    };


    // 예약삭제 처리 함수
    const handleDeleteReservation = async (reservationId) => {
        try {
            await dispatch(deleteReservation(reservationId));
            alert("예약이 삭제되었습니다.");
        } catch (error) {
            console.error("예약 삭제 실패:", error);
            alert("예약 삭제에 실패했습니다.");
        }
    };

    // 리뷰 작성 핸들러
    const handleAddReview = (hotelId, reservationId) => {
        if (userDetail && userDetail.id) {
            navigate(`/add-review/${hotelId}/${reservationId}`);
        } else {
            console.error('사용자 ID가 누락되었습니다');
        }
    };

    const isReviewable = (reservationEndAt) => {
        const today = new Date();
        const endDate = new Date(reservationEndAt);
        return endDate < today;
    };

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                <h1 className={styles.title}>호텔 예약 내역</h1>
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
                                        <div><strong>주문 총액 :</strong> {formatPrice(reservation.price)}</div>
                                        <div><strong>호텔 위치 :</strong> {reservation.hotel.location}</div>
                                        <div><strong>예약날짜
                                            :</strong> {new Date(reservation.reservationAt).toLocaleDateString()}</div>
                                        <div><strong>예약 종료
                                            날짜:</strong> {new Date(reservation.reservationEndAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={styles.reservationActions}>
                                        <Link to={`/detail-reservation`} className={styles.link}>
                                            상세조회
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteReservation(reservation.reservationId)}
                                            className={styles.link}
                                        >
                                            예약취소
                                        </button>
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
        </div>
    );
};

export default HotelRecords;
