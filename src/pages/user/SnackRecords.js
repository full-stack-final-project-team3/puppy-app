import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './SnackRecords.module.scss';
import { SHOP_URL } from '../../config/user/host-config';
import packageImg from '../../assets/shop/packageImg.jpg';
import Footer from '../../layout/user/Footer';

const subscriptionPeriodLabels = {
    ONE: "1개월",
    MONTH3: "3개월",
    MONTH6: "6개월",
};

const formatDate = (date) => {
    if (!date) return ''; // 날짜가 없을 경우 빈 문자열 반환

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    // Date 객체로 변환 후 원하는 형식으로 변환
    return new Date(date).toLocaleString('ko-KR', options);
};

// Portal을 사용한 Modal 컴포넌트
const Modal = ({ title, message, onConfirm, onClose, confirmButtonText, showCloseButton }) => {
    return ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{title}</h2>
                <p>{message}</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        {confirmButtonText}
                    </button>
                    {showCloseButton && (
                        <button className={styles.closeButton} onClick={onClose}>
                            아니오
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.getElementById('root') // Portal이 렌더링될 DOM 노드
    );
};

const SnackRecords = () => {
    const user = useSelector((state) => state.userEdit.userDetail);
    const [orderHistory, setOrderHistory] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
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
                    throw new Error('Failed to fetch order history');
                }
    
                const data = await response.json();
                setOrderHistory(data);
            } catch (error) {
                //console.error('주문 내역을 가져오지 못했다:', error);
            }
        };
    
        fetchOrderHistory();
    }, [user.id]);
    

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        return new Date(dateTimeString).toLocaleDateString('ko-KR', options).replace(/\./g, '.').trim();
    };

    const handleCancelOrder = async (orderId) => {
        if (!orderId) {
            //console.error('유효하지 않은 주문 ID:', orderId);
            return;
        }

        //console.log('취소할 주문 ID:', orderId); // 추가된 로그

        try {
            const response = await fetch(`${SHOP_URL}/orders/cancel/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('주문 취소 실패');
            }

            const updatedOrderHistory = orderHistory.map(order =>
                order.orderId === orderId ? { ...order, orderStatus: 'CANCELLED' } : order
            );
            setOrderHistory(updatedOrderHistory);
            setShowSuccessModal(true);
        } catch (error) {
            //console.error('주문 취소 실패:', error);
        }
    };

    const confirmCancelOrder = (orderId) => {
        //console.log('confirmCancelOrder 함수 호출 시 orderId:', orderId); // 추가된 로그
        setSelectedOrderIndex(orderId);
        setShowConfirmModal(true);
    };

    const closeModal = () => {
        setShowConfirmModal(false);
        setShowSuccessModal(false);
        setSelectedOrderIndex(null);
    };

    const handleViewDetails = (order) => {
        navigate('/order-detail', { state: { order } });
    };

    return (
        <>
        <div className={styles.wrap}>
            <MyPageHeader />
            <div className={styles.subWrap}>
                <h1 className={styles.title}>나의 구독 정보</h1>
                {orderHistory && orderHistory.length > 0 ? (
                    orderHistory.map((order, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.imageContainer}>
                                    <img src={packageImg} alt="패키지" className={styles.dogImage} />
                                </div>
                                <div className={styles.details}>
                                    <h2 
                                        className={order.orderStatus === 'CANCELLED' ? styles.cancelledText : ''}>
                                        <strong>{order.orderStatus === 'CANCELLED' ? '주문 취소' : '주문 완료'}</strong>
                                    </h2>
                                    <p><strong>주문 날짜: </strong> {formatDateTime(order.orderDateTime) || '에러'}</p>
                                    {order.bundles && order.bundles.length > 0 && order.bundles.map((bundle, bundleIndex) => (
                                        <div key={bundleIndex} className={styles.bundleItem}>
                                            <h3>반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</h3>
                                            <p><strong>상품 구독 기간: </strong> 
                                                {subscriptionPeriodLabels[bundle.subsType]}
                                            </p>
                                            <p><strong>구독 시작일: </strong> 
                                                {formatDate(bundle.subscriptionsStartDate)}
                                            </p>
                                            <p><strong>구독 만료일: </strong> 
                                                {formatDate(bundle.subscriptionsEndDate)}
                                            </p>
                                            <p><strong>구독 회차: </strong> 
                                                {bundle.subscriptionsCycle}회
                                            </p>
                                            {/* <p><strong>패키지 리스트:</strong></p>
                                            <ul>
                                                {bundle.treats?.map((treat, treatIndex) => (
                                                    <li key={treatIndex}>{treat.treatTitle}</li>
                                                ))}
                                            </ul> */}
                                        </div>
                                    ))}
                                    <p><strong>총 결제 금액: </strong> {order.totalPrice ? order.totalPrice.toLocaleString() : '0'}원</p>
                                </div>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={() => handleViewDetails(order)}>
                                        상세보기
                                    </button>
                                    {order.orderStatus !== 'CANCELLED' && (
                                    <button 
                                    className={`${styles.cancelButton} ${styles.cancelButton_gray}`}
                                        onClick={() => {
                                            //console.log('버튼 클릭 시 전달된 주문 ID:', order.orderId);
                                            confirmCancelOrder(order.orderId);
                                        }}>
                                        주문 취소
                                    </button>
                                    
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noOrder}>구독 내역이 없습니다.</p>
                )}
            </div>
            {showConfirmModal && (
                <Modal
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
            {showSuccessModal && (
                <Modal
                    title="알림"
                    message="주문이 취소되었습니다."
                    onConfirm={closeModal}
                    confirmButtonText="확인"
                    showCloseButton={false}
                />
            )}
        </div>
       
      <Footer /> 
      </>
    );
};

export default SnackRecords;
