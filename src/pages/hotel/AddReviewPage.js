import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, setReviewContent, setRate, fetchReviews } from '../../components/store/hotel/HotelReviewSlice';
import styles from './AddReviewPage.module.scss';
import RatingInput from '../shop/review/RatingInput';
import MyPageHeader from '../../components/auth/user/mypage/MyPageHeader';
import HotelModal from '../../components/hotel/HotelModal';

const AddReviewPage = () => {
    const { hotelId, reservationId } = useParams();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const userId = userDetail.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviewContent, rate, loading, reviews } = useSelector((state) => state.reviews);
    const [customError, setCustomError] = useState('');
    const [hasReviewed, setHasReviewed] = useState(false);
    const [showModal, setShowModal] = useState(false); // 모달 상태 관리

    useEffect(() => {
        dispatch(fetchReviews(reservationId)).then(({ payload }) => {
            if (payload && Array.isArray(payload.reviews)) {
                const userHasReviewed = payload.reviews.some(review => review.userId === userId);
                if (userHasReviewed) {
                    setHasReviewed(true);
                    navigate('/mypage');
                }
            }
        }).catch(error => {
            console.error('Error fetching reviews:', error);
        });
    }, [dispatch, hotelId, userId, navigate, reservationId]);

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
        const reviewData = { hotelId, reviewContent, rate, userId, reservationId };
        dispatch(addReview(reviewData))
            .unwrap()
            .then(() => {
                setShowModal(true); // 리뷰 작성 성공 시 모달 표시
            })
            .catch((err) => {
                const { message, status } = handleError(err);
                setCustomError(message);
                navigate('/error', { state: { message, status } });
            });
    };

    const handleClose = () => {
        setShowModal(false);
        navigate('/mypage');
    };

    if (hasReviewed) {
        return null;
    }

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <div className={styles.addReviewPage}>
                    <form onSubmit={handleReviewSubmit}>
                        <textarea
                            name="reviewContent"
                            placeholder="Write your review here..."
                            value={reviewContent}
                            onChange={(e) => dispatch(setReviewContent(e.target.value))}
                            maxLength={30}
                            required
                        />
                        <label>
                            Rate:
                            <RatingInput onClick={styles.star} value={rate} onChange={(newRate) => dispatch(setRate(newRate))} />
                        </label>
                        <button type="submit" disabled={loading}>Submit Review</button>
                        {customError && <p className={styles.error}>{customError}</p>}
                    </form>
                    <button onClick={() => navigate('/hotel')}>Back to List</button>
                </div>
                {showModal && (
                    <HotelModal
                        title="리뷰 작성 완료"
                        message="리뷰가 성공적으로 등록되었습니다!"
                        onConfirm={handleClose}
                        onClose={() => setShowModal(false)}
                        confirmButtonText="확인"
                    />
                )}
            </div>
        </div>
    );
};

export default AddReviewPage;
