import React, { useEffect } from 'react';
import styles from './HotelReview.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../../components/store/hotel/FavoriteSlice';
import { fetchReviews } from '../../components/store/hotel/HotelReviewSlice';
import { fetchHotels } from '../../components/store/hotel/HotelPageSlice';
import { fetchUserReservations } from '../../components/store/hotel/ReservationSlice';
import { useParams } from 'react-router-dom';

const HotelReview = () => {
    const { hotelId } = useParams();
    const dispatch = useDispatch();

    const review = useSelector(state => state.reviews);
    const { userReservations, status, error } = useSelector(state => state.reservation);
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
            <div>
                <div>
                    <span>{review.nickName}</span>
                    <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                </div>
                <div>
                    <p>{review.reviewContent}</p>
                </div>
                <div>
                    <span>Rating: {review.rate}</span>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2>Hotel Reviews</h2>
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
