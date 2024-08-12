import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './HotelReview.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteReview,
    fetchReviews,
    modifyReview
} from '../../components/store/hotel/HotelReviewSlice';
import { fetchUserReservations } from '../../components/store/hotel/ReservationSlice';
import { Modal, ModalBody, Button } from "reactstrap";
import { FaStar } from 'react-icons/fa';
import RatingInput from '../shop/review/RatingInput';

const HotelReview = () => {
    const { hotelId } = useParams();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState({ reviewContent: '', rate: 0 });

    const reviewsByReservationId = useSelector(state => state.reviews.reviewsByReservationId);
    const { userReservations } = useSelector(state => state.reservation);
    const userDetail = useSelector((state) => state.userEdit.userDetail);
    const userId = userDetail.id;

    // 별점 랜더링
    const renderStars = (rate) => {
        return Array(rate)
            .fill()
            .map((_, index) => (
                <FaStar key={index} className={styles.starIcon} />
            ));
    };

    // 사용자의 예약 목록 가져오기
    useEffect(() => {
        dispatch(fetchUserReservations({ userId }));
    }, [dispatch, userId]);

    // 모든 예약에 대한 리뷰 가져오기
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

    // 리뷰 삭제
    const deleteReviewHandler = async (reviewId) => {
        try {
            await dispatch(deleteReview({ reviewId, userId }));
            alert("리뷰가 삭제되었습니다.");
            // 삭제 후 리뷰 목록 다시 불러오기
            await dispatch(fetchUserReservations({ userId }));
        } catch (error) {
            console.error("리뷰 삭제 실패:", error);
            alert("리뷰 삭제에 실패했습니다.");
        }
    };

    // 리뷰 수정 모달 열기
    const openModal = (review) => {
        setEditingReview(review);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingReview({ reviewContent: '', rate: 0 });
    };

    // 리뷰 수정 저장
    const handleEditSubmit = async () => {
        try {
            await dispatch(modifyReview({
                reviewId: editingReview.id,
                userId,
                reviewContent: editingReview.reviewContent,
                rate: editingReview.rate
            }));
            alert("리뷰가 수정되었습니다.");
            closeModal();
            // 수정 후 리뷰 목록 다시 불러오기
            await dispatch(fetchUserReservations({ userId }));
        } catch (error) {
            console.error("리뷰 수정 실패:", error);
            alert("리뷰 수정에 실패했습니다.");
        }
    };

    // 입력 값 변경 처리
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingReview(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 리뷰 항목 컴포넌트
    const ReviewItem = ({ review }) => {
        return (
            <div className={styles.reviewWrap}>
                <div className={styles.reviewHeader}>
                    <span>{review.nickName}</span>
                    <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                </div>
                <span className={styles.hotelName}>{review.hotelName}</span>
                <div className={styles.reviewContent}>
                    <p>{review.reviewContent}</p>
                </div>
                <div className={styles.reviewFooter}>
                    <span>Rating: 
                        <span className={styles.star}>&nbsp;{renderStars(review.rate)}</span>
                    </span>
                    <div className={styles.actions}>
                        <button className={styles.actionLink} onClick={() => deleteReviewHandler(review.id)}>삭제</button>
                        <button className={styles.actionLink} onClick={() => openModal(review)}>수정</button>
                    </div>
                </div>
            </div>
        );
    };

    // 사용자의 모든 예약에 대한 리뷰들을 추출
    const userReviews = userReservations.reduce((acc, reservation) => {
        const reservationReviews = reviewsByReservationId[reservation.reservationId] || [];
        return acc.concat(reservationReviews.filter(review => review.userId === userId));
    }, []);

    return (
        <div className={styles.wrap}>
            <h2 className={styles.h2}>Hotel Reviews</h2>
            {userReviews.length > 0 ? (
                userReviews.map((rev) => (
                    <ReviewItem key={rev.id} review={rev} />
                ))
            ) : (
                <p className={styles.noReview}>작성하신 리뷰가 없습니다!</p>
            )}

            <Modal isOpen={isModalOpen} toggle={closeModal} className={styles.modal}>

                <ModalBody className={styles.modalBody}>
                        <textarea
                            name="reviewContent"
                            placeholder="Write your review here..."
                            value={editingReview.reviewContent}
                            onChange={handleChange}
                            required
                            className={styles.textarea}
                        />
                    <label className={styles.label}>
                        Rate:
                        <RatingInput
                            value={editingReview.rate}
                            onChange={(newRate) => handleChange({ target: { name: 'rate', value: newRate } })}
                        />
                    </label>
                    <div className={styles.modalActions}>
                        <Button
                            className={styles.primaryButton}
                            color="primary"
                            onClick={handleEditSubmit}>
                            저장
                        </Button>{' '}
                        <Button
                            className={styles.secondaryButton}
                            color="secondary"
                            onClick={closeModal}>
                            취소
                        </Button>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default HotelReview;
