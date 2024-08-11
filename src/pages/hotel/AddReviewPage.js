import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, setReviewContent, setRate, fetchReviews } from '../../components/store/hotel/HotelReviewSlice';
import styles from './AddReviewPage.module.scss';
import RatingInput from '../shop/review/RatingInput';
import MyPageHeader from '../../components/auth/user/mypage/MyPageHeader';

const AddReviewPage = () => {
    const { hotelId, reservationId } = useParams();
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const userId = userDetail.id;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { reviewContent, rate, loading, reviews } = useSelector((state) => state.reviews);
    const [customError, setCustomError] = useState('');
    const [hasReviewed, setHasReviewed] = useState(false);
    const { userReservations } = useSelector(state => state.reservation);
    // const reservationId = userReservations.reservationId;

    console.log("호텔과, 룸의 정보 가져오기 ", userReservations)
    console.log("예약 번호", reservationId);
    console.log("호텔번호", hotelId)


    useEffect(() => {
        // 리뷰 목록을 가져와서 이미 작성된 리뷰가 있는지 확인
        dispatch(fetchReviews(reservationId)).then(({ payload }) => {
            if (payload && Array.isArray(payload.reviews)) {
                const userHasReviewed = payload.reviews.some(review => review.userId === userId);
                if (userHasReviewed) {
                    setHasReviewed(true);
                    alert('이미 이 예약에 대한 리뷰를 작성했습니다.');
                    navigate('/mypage');
                }
            } else {
                console.error('Unexpected payload format:', payload);
            }
        }).catch(error => {
            console.error('Error fetching reviews:', error);
        });
    }, [dispatch, hotelId, userId, navigate, userReservations]);

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
        const reviewData = { hotelId, reviewContent, rate, userId, reservationId };
        dispatch(addReview(reviewData))
            .unwrap()
            .then(() => {
                alert('리뷰가 작성되었습니다!');
                navigate('/mypage');

            })
            .catch((err) => {
                const { message, status } = handleError(err);
                setCustomError(message);
                navigate('/error', { state: { message, status } });
            });
    };

    // 이미 리뷰를 작성한 경우 빈 컴포넌트를 반환하여 렌더링을 막음
    if (hasReviewed) {
        return null;
    }

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
            <div className={styles.addReviewPage}>
                <form onSubmit={handleReviewSubmit}>

                    <textarea
                        name="reviewContent"
                        placeholder="Write your review here..."
                        value={reviewContent}
                        onChange={(e) => dispatch(setReviewContent(e.target.value))}
                        required
                    />
                    <label>
                    Rate:
                    <RatingInput onClick={styles.star}value={rate} onChange={(newRate) => dispatch(setRate(newRate))} />
                </label>
                    <button type="submit" disabled={loading}>Submit Review</button>
                    {customError && <p className={styles.error}>{customError}</p>}
                </form>
                <button onClick={() => navigate('/hotel')}>Back to List</button>
            </div>
            </div>
        </div>
    );
};

export default AddReviewPage;
