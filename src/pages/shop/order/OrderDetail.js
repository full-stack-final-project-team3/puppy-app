import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import OrderModal from './OrderModal'; // 모달 창 컴포넌트 임포트
import styles from './scss/OrderDetail.module.scss';

const subscriptionPeriodLabels = {
    ONE: "1개월",
    MONTH3: "3개월",
    MONTH6: "6개월",
};

// 구독 만료 기간을 계산하는 함수
const calculateExpiryDate = (startDate, subscriptionPeriod) => {
    const expiryDate = new Date(startDate);
    const monthsToAdd = {
        ONE: 1,
        MONTH3: 3,
        MONTH6: 6,
    };
    expiryDate.setMonth(expiryDate.getMonth() + monthsToAdd[subscriptionPeriod]);
    return expiryDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const formatDateTime = (dateTimeString) => {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    };
    return new Date(dateTimeString).toLocaleString('ko-KR', options);
};

const OrderDetail = () => {
    const location = useLocation();
    const order = location.state?.order; // 전달된 order 데이터를 받아옴, 없을 경우 undefined
    const [orderDetail, setOrderDetail] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false); // 모달 상태 추가
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8888/shop/orders/${order.orderId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch order detail');
                }
    
                const data = await response.json();
                setOrderDetail(data);
            } catch (error) {
                console.error('주문 내역을 가져오지 못했다:', error);
            }
        };
    
        fetchOrderDetail();
    }, [order.orderId]);

    // 주문 취소 핸들러 추가
    const handleCancelOrder = async () => {
        try {
            const response = await fetch(`http://localhost:8888/shop/orders/cancel/${order.orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('주문 취소 실패');
            }

            // 주문 상태를 취소로 업데이트
            setOrderDetail(prevDetail => ({ ...prevDetail, orderStatus: 'CANCELLED' }));
            setShowSuccessModal(true);
        } catch (error) {
            console.error('주문 취소 실패:', error);
        }
    };

    const confirmCancelOrder = () => {
        setShowConfirmModal(true);
    };

    const closeModal = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(false);
    };

    if (!order) {
        return <div className={styles.wrap}><p>주문 정보를 불러올 수 없습니다.</p></div>;
    }

    return (
        <div className={styles.wrap}>
            <h1 className={styles.title}>주문 상세 내역</h1>
            <h2 
                className={orderDetail.orderStatus === 'CANCELLED' ? styles.cancelledText : ''}>
                <strong>{orderDetail.orderStatus === 'CANCELLED' ? '주문 취소' : '주문 완료'}</strong>
            </h2>
            <div className={styles.orderDetail}>
                <div className={styles.userInfo}>
                    <h2>받는 사람 정보</h2>
                    <p><strong>이름:</strong> {orderDetail.receiverName || '정보 없음'}</p>
                    <p><strong>연락처:</strong> {orderDetail.receiverPhone || '정보 없음'}</p>
                    <p><strong>주소:</strong> {orderDetail.address || '정보 없음'} {orderDetail.addressDetail || ''}</p>
                    <p><strong>배송 요청 사항:</strong> {orderDetail.deliveryRequest === "기타사항" ? orderDetail.customRequest : orderDetail.deliveryRequest || '없음'}</p>
                </div>
                <div className={styles.bundles}>
                    <h2>주문 상품 : <span> {formatDateTime(order.orderDateTime) || '에러'}</span></h2>
                    {order.bundles?.map((bundle, index) => (
                        <div key={index} className={styles.bundleItem}>
                            <h3>반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</h3>
                            <p><strong>상품 구독 기간:</strong> {subscriptionPeriodLabels[bundle.subsType] || '구독 기간 정보 없음'}</p>
                            <p><strong>구독 만료 기간:</strong> 
                                {calculateExpiryDate(order.orderDateTime, bundle.subsType)}
                            </p>
                            <p><strong>패키지 리스트:</strong></p>
                            <ul>
                                {bundle.treats?.map((treat, treatIndex) => (
                                    <li key={treatIndex}>{treat.treatTitle}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className={styles.totalPrice}>
                    <h2>총 금액</h2>
                    <p>{orderDetail.totalPrice ? orderDetail.totalPrice.toLocaleString() : '0'} 원</p>
                </div>
            </div>
            {orderDetail.orderStatus !== 'CANCELLED' && (
                <div className={styles.actions}>
                    <button 
                        className={styles.cancelButton}
                        onClick={() => {
                            console.log('오다 아이디 :', order.orderId); 
                            confirmCancelOrder(); 
                        }}>
                        주문 취소
                    </button>
                </div>
            )}
            {showConfirmModal && (
                <OrderModal
                    title="결제 확인"
                    message="정말로 주문을 취소하시겠습니까?"
                    onConfirm={() => {
                        handleCancelOrder();
                        setShowConfirmModal(false);
                    }}
                    onClose={closeModal}
                    confirmButtonText="예"
                    showCloseButton={true}
                />
            )}
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

export default OrderDetail;
