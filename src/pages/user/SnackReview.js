import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import OrderModal from '../../pages/shop/order/OrderModal';
import styles from './SnackReview.module.scss';
import { SHOP_URL, RESOURCES_URL } from '../../config/user/host-config';
import Modal from 'react-modal';
import WriteReviewPage from '../../pages/shop/review/WriteReviewPage'; 
import EditReviewPage from '../../pages/shop/review/EditReviewPage'; 
import TreatsDetailModal from "../../pages/shop/TreatsDetailModal";

// Modal 스타일 설정
Modal.setAppElement('#root');

const SnackReview = () => {
    const user = useSelector((state) => state.userEdit.userDetail);
    const [orderHistory, setOrderHistory] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedTreat, setSelectedTreat] = useState({ reviewId: null, orderId: null, treatId: null, dogId: null, treatTitle: '' });  // 선택된 treat 상태
    const navigate = useNavigate();

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
                console.log(data);
                setOrderHistory(data);
            } catch (error) {
                console.error('주문 내역을 가져오지 못했습니다:', error);
            }
        };
    
        fetchOrderHistory();
    }, [user.id]);

    const openReviewModal = (orderIdddd, treatId, dogId, treatTitle) => {
        setSelectedTreat({ orderId: orderIdddd, treatId: treatId, dogId: dogId, treatTitle: treatTitle });  // 선택된 treatId와 treatTitle 설정
        setIsReviewModalOpen(true);
    };

    const openEditModal = (reviewId, orderId, treatId, treatTitle) => {
        setSelectedTreat({ reviewId, orderId, treatId, treatTitle });
        setIsEditModalOpen(true);
    };

    const openProductModal = (treatId) => {
        console.info("openProductModal")

        setSelectedTreat({ treatId });
        setIsProductModalOpen(true);
    };
    

    const closeModal = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(false);
        setSelectedOrderIndex(null);

        setIsReviewModalOpen(false);
        setIsEditModalOpen(false);
        setIsProductModalOpen(false);
    };

    return (
        <div className={styles.wrap}>
            {orderHistory && orderHistory.length > 0 ? (
                orderHistory
                    .filter(order => order.orderStatus !== 'CANCELLED') // 주문 상태가 "CANCELLED"인 것을 제외
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
                                                            <p>{treat.treatTitle}</p>
                                                        </a>
                                                        <button 
                                                            hidden={!!treat.reviewId} // 리뷰가 있는 경우 숨김
                                                            className={styles.review_button}
                                                            onClick={() => openReviewModal(order.orderId, treat.treatId, bundle.dogId, treat.treatTitle)} // 클릭 시 리뷰 작성 모달 열기
                                                        >
                                                            리뷰 작성하기
                                                        </button>
                                                        <button 
                                                            hidden={!treat.reviewId} // 리뷰가 없는 경우 숨김
                                                            className={styles.review_button}
                                                            onClick={() => openEditModal(treat.reviewId, order.orderId, treat.treatId, treat.treatTitle)} // 클릭 시 리뷰 수정 모달 열기
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
            <Modal
                isOpen={isReviewModalOpen}
                onRequestClose={closeModal}
                contentLabel="리뷰 작성하기"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <WriteReviewPage orderId={selectedTreat.orderId} treatId={selectedTreat.treatId} dogId={selectedTreat.dogId} treatTitle={selectedTreat.treatTitle} /> {/* treatId와 treatTitle 전달 */}
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeModal}
                contentLabel="리뷰 수정하기"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <EditReviewPage reviewId={selectedTreat.reviewId} orderId={selectedTreat.orderId} treatId={selectedTreat.treatId} treatTitle={selectedTreat.treatTitle} /> {/* treatId와 treatTitle 전달 */}
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
