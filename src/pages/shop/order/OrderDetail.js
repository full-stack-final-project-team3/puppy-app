import React from 'react';
import { useLocation } from 'react-router-dom'; 
import styles from './scss/OrderDetail.module.scss';
import { useDispatch, useSelector } from 'react-redux';

const OrderDetail = () => {
    const user = useSelector((state) => state.userEdit.userDetail);
    const location = useLocation();
    const { order } = location.state; // 전달된 order 데이터를 받아옴

    return (
        <div className={styles.wrap}>
            <h1>주문 상세 내역</h1>
            <div className={styles.orderInfo}>
                <p><strong>이름: {user.nickname}</strong> </p>
                <p><strong>이메일: {user.email}</strong> </p>
                <p><strong>핸드폰 번호: {user.phoneNumber}</strong></p>
                <p><strong>주소:</strong></p>
            </div>
            {order.bundles.map((bundle, index) => (
                <div key={index} className={styles.bundleItem}>
                    <p><strong>상품명 :</strong> 반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</p>
                    <p><strong>상품 구독 기간 :</strong> 
                        {order.subscriptionPeriods[bundle.id]}
                    </p>
                    <p><strong>패키지 리스트:</strong></p>
                    <ul>
                        {bundle.treats.map((treat, treatIndex) => (
                            <li key={treatIndex}>{treat.treatsTitle}</li>
                        ))}
                    </ul>
                </div>
            ))}
            <div className={styles.totalPrice}>
                <p><strong>총 금액:</strong> {order.totalPrice ? order.totalPrice.toLocaleString() : 'N/A'}원</p>
            </div>
        </div>
    );
};

export default OrderDetail;
