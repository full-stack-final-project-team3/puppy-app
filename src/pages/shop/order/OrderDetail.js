import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import OrderModal from './OrderModal'; // 모달 창 컴포넌트 임포트
import styles from './scss/OrderDetail.module.scss';
import { SHOP_URL } from '../../../config/user/host-config';

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
                const response = await fetch(`${SHOP_URL}/orders/${order.orderId}`, {
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
            const response = await fetch(`${SHOP_URL}/orders/cancel/${order.orderId}`, {
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
            <div className={`${styles.order_status}`}>
                <h4>
                    {formatDateTime(order.orderDateTime) || '에러'}
                    <span className={orderDetail.orderStatus === 'CANCELLED' ? styles.cancelledText : ''}>
                        {orderDetail.orderStatus === 'CANCELLED' ? '주문 취소' : '주문 완료'}
                    </span>
                </h4>
            </div>
            <div className={`${styles.pay_info} ${styles.order_detail_common_box}`}>
                <div>
                    <h4>결제 정보</h4>
                    <div>
                        <p>
                            상품 가격 
                            <span>
                                {orderDetail.totalPrice ? orderDetail.totalPrice.toLocaleString() : '0'} 원
                            </span>
                            </p>
                        <p>배송비<span>0</span>
                        </p>
                        <hr />
                        <p>
                            포인트
                            <span>
                                {orderDetail.totalPrice ? orderDetail.totalPrice.toLocaleString() : '0'} 원
                                </span>
                            </p>
                        <p>
                            총 결제금액
                            <span>0 원</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className={`${styles.order_delivery} ${styles.order_detail_common_box}`}>
                <h4>배송정보</h4>
                <p>{orderDetail.receiverName || '정보 없음'}</p>
                <p>{orderDetail.receiverPhone || '정보 없음'}</p>
                <p>{orderDetail.address || '정보 없음'} {orderDetail.addressDetail || ''}</p>
                {/* <p><span>이름 : </span>{orderDetail.receiverName || '정보 없음'}</p>
                <p><span>연락처 : </span>{orderDetail.receiverPhone || '정보 없음'}</p>
                <p><span>주소 : </span>{orderDetail.address || '정보 없음'} {orderDetail.addressDetail || ''}</p> */}
                <p>
                    배송 요청사항 : 
                    {orderDetail.deliveryRequest === "기타사항" ? orderDetail.customRequest : orderDetail.deliveryRequest || '없음'}
                    </p>
            </div>

            <div className={`${styles.orderDetail} ${styles.order_detail_common_box}`}>
                <div className={styles.bundles}>
                    <h4>상품정보</h4>
                    {order.bundles?.map((bundle, index) => (
                        <div key={index} className={styles.bundleItem}>
                            <h3>
                                반려견 전용 맞춤형 푸드 패키지 For "{bundle.dogName}"
                            </h3>
                            <ul>
                                {bundle.treats?.map((treat, treatIndex) => (
                                    <li key={treatIndex}>{treat.treatTitle}</li>
                                ))}
                            </ul>
                            <p>
                                <strong>상품 구독 기간:</strong> 
                                {subscriptionPeriodLabels[bundle.subsType] || '구독 기간 정보 없음'}
                            </p>
                            <p>
                                <strong>구독 만료 기간:</strong>
                                {calculateExpiryDate(order.orderDateTime, bundle.subsType)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            {orderDetail.orderStatus !== 'CANCELLED' && (
                <button
                    className={styles.order_cancel_btn}
                    onClick={() => {
                        console.log('오다 아이디 :', order.orderId);
                        confirmCancelOrder();
                    }}>
                    주문 취소
                </button>
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
