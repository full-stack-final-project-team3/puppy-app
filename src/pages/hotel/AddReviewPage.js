import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, setReviewContent, setRate } from '../../components/store/hotel/HotelReviewSlice';
import styles from './AddReviewPage.module.scss';

const AddReviewPage = () => {
    const { hotelId } = useParams();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const userId = userDetail.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviewContent, rate, loading } = useSelector((state) => state.reviews);
    const [customError, setCustomError] = useState('');

    // 에러 메시지를 사용자 친화적인 형태로 변환하는 함수
    const handleError = (error) => {
        const errorMessage = typeof error === 'string' ? error : error.error;
        if (errorMessage.includes('예약이 존재하지 않습니다')) {
            return { message: '리뷰를 작성하기 전에 이 호텔에 대한 예약을 완료해주세요.', status: 400 };
        }
        if (errorMessage.includes('404')) {
            return { message: '서버에서 요청한 리소스를 찾을 수 없습니다. 서버 관리자에게 문의하세요.', status: 404 };
        }
        return { message: '리뷰를 추가하는 중 문제가 발생했습니다. 나중에 다시 시도해주세요.', status: 500 };
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!userId) {
            console.error('사용자 ID가 누락되었습니다');
            return;
        }
        const reviewData = { hotelId, reviewContent, rate, userId };
        dispatch(addReview(reviewData))
            .unwrap()
            .then(() => {
                alert('리뷰가 작성되었습니다!');
                navigate('/hotel');
            })
            .catch((err) => {
                const { message, status } = handleError(err);
                setCustomError(message);
                navigate('/error', { state: { message, status } }); // 에러 페이지로 리디렉션
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
                {customError && <p className={styles.error}>{customError}</p>}
            </form>
            <button onClick={() => navigate('/hotel')}>Back to List</button>
        </div>
    );
};

export default AddReviewPage;
