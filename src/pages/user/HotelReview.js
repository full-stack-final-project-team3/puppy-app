import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HotelReview.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../../components/store/hotel/HotelReviewSlice';
import { fetchUserReservations } from '../../components/store/hotel/ReservationSlice';
import { useParams } from 'react-router-dom';

const HotelReview = () => {
    const { hotelId } = useParams();
    const dispatch = useDispatch();

    const review = useSelector(state => state.reviews);
    const { userReservations } = useSelector(state => state.reservation);
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const userId = userDetail.id;

    useEffect(() => {
        dispatch(fetchUserReservations({ userId }));
    }, [dispatch, userId]);

    useEffect(() => {
        const fetchAllReviews = async () => {
            if (userReservations.length > 0) {
                for (const reservation of userReservations) {
                    await dispatch(fetchReviews(reservation.hotelId)).unwrap();
                }
            }
        };
        fetchAllReviews();
    }, [dispatch, userReservations]);

    const ReviewItem = ({ review }) => {
        return (
            <div className={styles.reviewWrap}>
                <div className={styles.reviewHeader}>
                    <span>{review.nickName}</span>
                    <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                </div>
                            {/* ↓  여깁니다  ↓ */}
                <span className={styles.hotelName}>캔디 모텔</span>
                <div className={styles.reviewContent}>
                    <p>{review.reviewContent}</p>
                </div>
                <div className={styles.reviewFooter}>
                    <span>Rating: {review.rate}</span>
                    <div className={styles.actions}>
                        <Link to={`/edit-review/${review.id}`} className={styles.actionLink}>수정</Link>
                        <Link to={`/delete-review/${review.id}`} className={styles.actionLink}>삭제</Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.wrap}>
            <h2 className={styles.h2}>Hotel Reviews</h2>
            {review.reviews && review.reviews.length > 0 ? (
                review.reviews
                    .filter(rev => rev.userId === userId)
                    .map((rev) => (
                        <ReviewItem key={rev.id} review={rev} />
                    ))
            ) : (
                <p>No reviews available.</p>
            )}
        </div>
    );
};

export default HotelReview;