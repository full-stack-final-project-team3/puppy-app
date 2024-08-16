import React from 'react';
import { useLocation } from 'react-router-dom'; 
import { useSelector } from 'react-redux';
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
    const user = useSelector((state) => state.userEdit.userDetail);
    const location = useLocation();
    const order = location.state?.order; // 전달된 order 데이터를 받아옴, 없을 경우 undefined

    if (!order) {
        return <div className={styles.wrap}><p>주문 정보를 불러올 수 없습니다.</p></div>;
    }

    return (
        <div className={styles.wrap}>
            <h1 className={styles.title}>주문 상세 내역</h1>
            <div className={styles.orderDetail}>
                <div className={styles.userInfo}>
                    <h2>주문자 정보</h2>
                    <p><strong>이름:</strong> {user?.nickname || '에러'}</p>
                    <p><strong>이메일:</strong> {user?.email || '에러'}</p>
                    <p><strong>핸드폰 번호:</strong> {user?.phoneNumber || '에러'}</p>
                    <p><strong>주소:</strong> {user?.address || '에러'}</p>
                </div>
                <div className={styles.orderInfo}>
                    <h2>주문 정보</h2>
                    <p><strong>주문 날짜:</strong> {formatDateTime(order.orderDateTime) || '에러'}</p>
                    <p><strong>배송 요청 사항:</strong> {order.deliveryRequest || '없음'}</p>
                </div>
                <div className={styles.bundles}>
                    <h2>주문 상품</h2>
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
                    <p>{order.totalPrice ? order.totalPrice.toLocaleString() : '에러'} 원</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
