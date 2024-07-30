import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, setReviewContent, setRate } from '../../components/store/hotel/HotelReviewSlice';
import styles from './AddReviewPage.module.scss';

const AddReviewPage = () => {
    const { hotelId } = useParams();
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviewContent, rate, loading, error } = useSelector((state) => state.reviews);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!userId) {
            console.error('사용자 ID가 누락되었습니다');
            return;
        }
        const reviewData = { hotelId, reviewContent, rate, userId };
        console.log('Submitting review:', reviewData); // 데이터 확인
        dispatch(addReview(reviewData))
            .unwrap()
            .then(() => {
                alert('리뷰가 작성되었습니다!!');
                navigate('/hotel');
            })
            .catch((err) => {
                console.error('Failed to add review:', err);
            });
    };

    return (
        <div className={styles.addReviewPage}>
            <form onSubmit={handleReviewSubmit}>
                <h1>Write a Review</h1>
                <textarea
                    name="reviewContent"
                    placeholder="Write your review here..."
                    value={reviewContent}
                    onChange={(e) => dispatch(setReviewContent(e.target.value))}
                    required
                />
                <label>
                    Rate:
                    <select
                        value={rate}
                        onChange={(e) => dispatch(setRate(Number(e.target.value)))}
                        required
                    >
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </label>
                <button type="submit" disabled={loading}>Submit Review</button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
            <button onClick={() => navigate('/hotel')}>Back to List</button>
        </div>
    );
};

export default AddReviewPage;
