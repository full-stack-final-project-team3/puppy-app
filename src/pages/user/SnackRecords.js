import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate 추가
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import OrderModal from '../../pages/shop/order/OrderModal';  // OrderModal 컴포넌트 불러오기
import styles from './SnackRecords.module.scss';

const subscriptionPeriodLabels = {
    ONE: "1개월",
    MONTH3: "3개월",
    MONTH6: "6개월",
};

const SnackRecords = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    const navigate = useNavigate(); // navigate 추가

    useEffect(() => {
        // localStorage에서 주문 내역 불러오기
        const savedOrderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        setOrderHistory(savedOrderHistory);
    }, []);

    const handleCancelOrder = (orderIndex) => {
        // 선택한 주문 내역 삭제
        const updatedOrderHistory = orderHistory.filter((_, index) => index !== orderIndex);
        setOrderHistory(updatedOrderHistory);
        localStorage.setItem('orderHistory', JSON.stringify(updatedOrderHistory));
        setShowSuccessModal(true);  // 주문 취소 완료 모달 표시
    };

    const confirmCancelOrder = (orderIndex) => {
        setSelectedOrderIndex(orderIndex);
        setShowConfirmModal(true);  // 주문 취소 확인 모달 표시
    };

    const closeModal = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(false);
        setSelectedOrderIndex(null);
    };

    const handleViewDetails = (order) => {
        navigate('/order-detail', { state: { order } }); // navigate로 상태 전달
    };

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h1 className={styles.title}>내가 구매한 간식들</h1>
                {orderHistory.length > 0 ? (
                    orderHistory.map((order, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.imageContainer}>
                                    <img src="https://via.placeholder.com/100" alt="반려견" className={styles.dogImage} />
                                </div>
                                <div className={styles.details}>
                                    <p><strong>주문 날짜 :</strong> {order.orderDate || 'N/A'}</p>
                                    {order.bundles.map((bundle, bundleIndex) => (
                                        <div key={bundleIndex} className={styles.bundleItem}>
                                            <p><strong>상품명 :</strong> 반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</p>
                                            <p><strong>상품 구독 기간 :</strong> 
                                                {subscriptionPeriodLabels[order.subscriptionPeriods[bundle.id]]}
                                            </p>
                                            <p><strong>패키지 리스트:</strong></p>
                                            <ul>
                                                {bundle.treats.map((treat, treatIndex) => (
                                                    <li key={treatIndex}>{treat.treatsTitle}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <p><strong>총 결제 금액 :</strong> {order.totalPrice ? order.totalPrice.toLocaleString() : 'N/A'}원</p>
                                </div>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={() => handleViewDetails(order)}> {/* 상세보기 클릭 시 */}
                                        상세보기
                                    </button>
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={() => confirmCancelOrder(index)}>
                                        상품취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>주문 내역이 없습니다.</p>
                )}
            </div>
            {/* 주문 취소 확인 모달 */}
            {showConfirmModal && (
                <OrderModal
                    title="결제 확인"
                    message="정말로 주문을 취소하시겠습니까?"
                    onConfirm={() => {
                        handleCancelOrder(selectedOrderIndex);
                        setShowConfirmModal(false);
                    }}
                    onClose={closeModal}
                    confirmButtonText="예"
                    showCloseButton={true}
                />
            )}

            {/* 주문 취소 완료 모달 */}
            {showSuccessModal && (
                <OrderModal
                    title="알림"
                    message="주문이 취소되었습니다."
                    onConfirm={closeModal}
                    confirmButtonText="확인"
                    showCloseButton={false}
                />
            )}
        </div>
    );
};

export default SnackRecords;
//성공1