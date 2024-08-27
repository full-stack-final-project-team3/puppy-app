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
import { Modal, Button } from "react-bootstrap"; // react-bootstrap에서 가져오기
import { FaStar } from 'react-icons/fa';
import RatingInput from '../shop/review/RatingInput';
import HotelModal from '../../components/hotel/HotelModal';

const HotelReview = () => {
    const { hotelId } = useParams();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState({ reviewContent: '', rate: 0 });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditConfirmModalOpen, setIsEditConfirmModalOpen] = useState(false);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [completionMessage, setCompletionMessage] = useState('');
    const [reviewToDelete, setReviewToDelete] = useState(null);

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

    // 리뷰 삭제 모달 열기
    const openDeleteModal = (review) => {
        setReviewToDelete(review);
        setIsDeleteModalOpen(true);
    };

    // 리뷰 삭제 처리
    const confirmDeleteReview = async () => {
        try {
            await dispatch(deleteReview({ reviewId: reviewToDelete.id, userId }));
            setIsDeleteModalOpen(false);
            setCompletionMessage('리뷰가 삭제되었습니다.');
            setIsCompletionModalOpen(true);
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

    // 수정 확인 모달 열기
    const openEditConfirmModal = () => {
        setIsModalOpen(false);  // 리뷰 수정 모달을 먼저 닫음
        setIsEditConfirmModalOpen(true);  // 그 후 확인 모달을 띄움
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
            setIsEditConfirmModalOpen(false);
            setCompletionMessage('리뷰가 수정되었습니다.');
            setIsCompletionModalOpen(true);
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
                        <button className={styles.actionLink} onClick={() => openModal(review)}>수정</button>
                        <button className={styles.actionLink} onClick={() => openDeleteModal(review)}>삭제</button>
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
                <p className={styles.noReview}>작성하신 리뷰가 없습니다.</p>
            )}

            <Modal show={isModalOpen} onHide={closeModal} className={styles.modal}>
                <Modal.Body className={styles.modalBody}>
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
                            variant="primary"
                            onClick={openEditConfirmModal}>
                            저장
                        </Button>{' '}
                        <Button
                            className={styles.secondaryButton}
                            variant="secondary"
                            onClick={closeModal}>
                            취소
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* 리뷰 삭제 확인 모달 */}
            {isDeleteModalOpen && (
                <HotelModal
                    title="리뷰 삭제"
                    message="정말로 이 리뷰를 삭제하시겠습니까?"
                    onConfirm={confirmDeleteReview}
                    onClose={() => setIsDeleteModalOpen(false)}
                    confirmButtonText="예"
                />
            )}

            {/* 리뷰 수정 확인 모달 */}
            {isEditConfirmModalOpen && (
                <HotelModal
                    title="리뷰 수정"
                    message="정말로 이 리뷰를 수정하시겠습니까?"
                    onConfirm={handleEditSubmit}
                    onClose={() => setIsEditConfirmModalOpen(false)}
                    confirmButtonText="예"
                />
            )}

            {/* 작업 완료 모달 */}
            {isCompletionModalOpen && (
                <HotelModal
                    title="완료"
                    message={completionMessage}
                    onConfirm={() => setIsCompletionModalOpen(false)}
                    onClose={() => setIsCompletionModalOpen(false)}
                    confirmButtonText="확인"
                    showCloseButton={false}
                />
            )}
        </div>
    );
};

export default HotelReview;
