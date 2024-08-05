import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews } from '../store/hotel/HotelReviewSlice'; // Adjust the file path accordingly
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import styles from './ReviewList.module.scss';
import { FaStar } from 'react-icons/fa';

const renderStars = (rate) => {
    return Array(rate)
        .fill()
        .map((_, index) => (
            <FaStar key={index} className={styles.starIcon} />
        ));
};

const sliderSettings = {
    slidesPerView: 2,
    slidesPerGroup: 2,
    spaceBetween: 20,
    pagination: false,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    speed: 500,
    loop: true,
    modules: [Pagination, Navigation],
};


const ReviewList = ({ hotelId }) => {
    const dispatch = useDispatch();
    const { loading, reviews, error } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (hotelId) {
            dispatch(fetchReviews(hotelId));
        }
    }, [dispatch, hotelId]);

    const sortedReviews = useMemo(() => {
        return reviews ? [...reviews].sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)) : [];
    }, [reviews]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (error) {
        return <p>Error loading reviews: {error.message}</p>;
    }

    if (!reviews || reviews.length === 0) {
        return <p>No reviews available</p>;
    }

    return (
        <div className={styles.reviewList}>
            <Swiper {...sliderSettings}>
                {sortedReviews.map((review) => (
                    <SwiperSlide key={review.id} className={styles.review}>
                        <p className={styles.reviewContent}>{review.reviewContent}</p>
                        <div className={styles.reviewDetails}>
                            <p className={styles.reviewRate}>Rating: {renderStars(review.rate)}</p>
                            <p className={styles.reviewDate}>Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
                            <p className={styles.reviewUser}>User: {review.nickName}</p>
                        </div>
                    </SwiperSlide>
                ))}
                <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
                <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
            </Swiper>
        </div>
    );
};

export default ReviewList;
