// components/ReviewList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../../components/store/hotel/HotelReviewSlice'; // 파일 경로를 적절히 수정하세요
import styles from './ReviewList.module.scss';

const ReviewList = ({ hotelId }) => {
    const dispatch = useDispatch();
    const { loading, reviews, error } = useSelector((state) => state.reviews);

    useEffect(() => {
        dispatch(fetchReviews(hotelId));
    }, [dispatch, hotelId]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error loading reviews: {error}</p>;
    }

    if (!reviews || reviews.length === 0) {
        return <p>No reviews available</p>;
    }

    return (
        <div className={styles.reviewList}>
            {reviews.map((review) => (
                <div key={review.id} className={styles.review}>
                    <p className={styles.reviewContent}>{review.reviewContent}</p>
                    <div className={styles.reviewDetails}>
                        <p className={styles.reviewRate}>Rating: {review.rate}</p>
                        <p className={styles.reviewDate}>Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
                        <p className={styles.reviewDate}>userName: {review.nickName}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;