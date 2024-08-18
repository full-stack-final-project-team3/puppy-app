import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import styles from './SnackReview.module.scss';
import { SHOP_URL, RESOURCES_URL } from '../../config/user/host-config';
import WriteReviewPage from '../../pages/shop/review/WriteReviewPage'; 
import EditReviewPage from '../../pages/shop/review/EditReviewPage'; 
import TreatsDetailModal from "../../pages/shop/TreatsDetailModal";

// Modal 스타일 설정
Modal.setAppElement('#root');

const SnackReview = () => {
    const user = useSelector((state) => state.userEdit.userDetail);
    const [orderHistory, setOrderHistory] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedTreat, setSelectedTreat] = useState({ reviewId: null, orderId: null, treatId: null, dogId: null, treatTitle: '' });
    const [visibleCount, setVisibleCount] = useState(1); // 보여지는 .card의 수를 관리하는 상태

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await fetch(`${SHOP_URL}/orders/user/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error('주문 내역을 가져오지 못했습니다.');
                }
    
                const data = await response.json();
                setOrderHistory(data);
            } catch (error) {
                console.error('주문 내역을 가져오지 못했습니다:', error);
            }
        };
    
        fetchOrderHistory();
    }, [user.id]);

    const openReviewModal = (orderId, treatId, dogId, treatTitle) => {
        setSelectedTreat({ orderId, treatId, dogId, treatTitle });
        setIsReviewModalOpen(true);
    };

    const openEditModal = (reviewId, orderId, treatId, treatTitle) => {
        setSelectedTreat({ reviewId, orderId, treatId, treatTitle });
        setIsEditModalOpen(true);
    };

    const openProductModal = (treatId) => {
        setSelectedTreat({ treatId });
        setIsProductModalOpen(true);
    };

    const closeModal = () => {
        setIsReviewModalOpen(false);
        setIsEditModalOpen(false);
        setIsProductModalOpen(false);
    };

    const showMoreCards = () => {
        setVisibleCount(prevCount => prevCount + 1); // 한 번에 한 개의 카드를 더 보여줍니다.
    };

    return (
        <div className={styles.wrap}>
            {orderHistory && orderHistory.length > 0 ? (
                orderHistory
                    .filter(order => order.orderStatus !== 'CANCELLED')
                    .slice(0, visibleCount) // visibleCount에 따라 보여줄 카드 수 제한
                    .map((order, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.details}>
                                    {order.bundles && order.bundles.length > 0 && order.bundles.map((bundle, bundleIndex) => (
                                        <div key={bundleIndex} className={styles.bundleItem}>
                                            <h3>반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</h3>
                                            <ul className={styles.snack_review_ul}>
                                                {bundle.treats?.map((treat, treatIndex) => (
                                                    <li className={styles.snack_review_li} key={treatIndex}>
                                                        <div className={styles.snack_review_box}>
                                                            <img 
                                                                className={styles.snack_review_img_sm} 
                                                                src={`${RESOURCES_URL}${treat.treatUrl}`} 
                                                                alt="간식 이미지" 
                                                            />
                                                        </div>
                                                        <a onClick={() => openProductModal(treat.treatId)}>
                                                            <p style={{ cursor: 'pointer' }}>{treat.treatTitle}</p>
                                                        </a>
                                                        <button 
                                                            hidden={!!treat.reviewId}
                                                            className={styles.review_button}
                                                            onClick={() => openReviewModal(order.orderId, treat.treatId, bundle.dogId, treat.treatTitle)}
                                                        >
                                                            리뷰 작성하기
                                                        </button>
                                                        <button 
                                                            hidden={!treat.reviewId}
                                                            className={styles.review_button}
                                                            onClick={() => openEditModal(treat.reviewId, order.orderId, treat.treatId, treat.treatTitle)}
                                                        >
                                                            리뷰 수정하기
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
            ) : (
                <p>주문 내역이 없습니다.</p>
            )}
            {orderHistory.length > visibleCount && ( // 더보기 버튼 표시 조건
                <button onClick={showMoreCards} className={styles.more_button}>
                    더보기
                </button>
            )}
            <Modal
                isOpen={isReviewModalOpen}
                onRequestClose={closeModal}
                contentLabel="리뷰 작성하기"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <WriteReviewPage orderId={selectedTreat.orderId} treatId={selectedTreat.treatId} dogId={selectedTreat.dogId} treatTitle={selectedTreat.treatTitle} />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeModal}
                contentLabel="리뷰 수정하기"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <EditReviewPage reviewId={selectedTreat.reviewId} orderId={selectedTreat.orderId} treatId={selectedTreat.treatId} treatTitle={selectedTreat.treatTitle} />
            </Modal>

            <TreatsDetailModal
                isOpen={isProductModalOpen}
                onClose={closeModal}
                treatsId={selectedTreat.treatId}
            />
        </div>
    );
};

export default SnackReview;
