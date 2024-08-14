import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { userEditActions } from '../../../components/store/user/UserEditSlice';
import styles from './scss/OrderPage.module.scss';
import OrderModal from './OrderModal';
import OrderInfo from './OrderInfo';
import ProductInfo from './ProductInfo';
import PaymentInfo from './PaymentInfo';
import { AUTH_URL } from '../../../config/user/host-config';

const OrderPage = () => {
  const user = useSelector((state) => state.userEdit.userDetail);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bundles, subscriptionPeriods, totalPrice } = location.state;
  
  const subscriptionPeriodLabels = {
    ONE: "1개월",
    MONTH3: "3개월",
    MONTH6: "6개월",
  };

  const [orderInfo, setOrderInfo] = useState({
    buyerPhone: user.phoneNumber || '',
    receiverName: user.nickname || '',
    receiverPhone: user.phoneNumber || '',
    receiverAddress: user.address || '',
  });

  const [remainingPoints, setRemainingPoints] = useState(user.point);
  const [canPurchase, setCanPurchase] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isConfirmStep, setIsConfirmStep] = useState(true);
  const [showPointPayment, setShowPointPayment] = useState(false);
  const [pointUsage, setPointUsage] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  useEffect(() => {
    const remaining = user.point - totalPrice;
    setRemainingPoints(remaining);
    setCanPurchase(false); // 기본적으로 결제 버튼은 비활성화
  }, [user.point, totalPrice]);

  const handlePhoneNumberChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverPhone: event.target.value });
  };

  const handleAddressChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverAddress: event.target.value });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${extraAddress}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setOrderInfo({ ...orderInfo, receiverAddress: fullAddress });
      }
    }).open();
  };

  const handleSubmit = () => {
    if (canPurchase) {
      setModalMessage("결제를 진행하시겠습니까?");
      setIsConfirmStep(true);
      setShowModal(true);
    }
  };

  const handlePaymentMethodClick = (method) => {
    if (method === 'point') {
      setShowPointPayment(!showPointPayment);
    } else {
      setModalMessage("추후 업데이트 예정입니다.");
      setIsConfirmStep(null);
      setShowModal(true);
    }
  };

  const handlePointChange = (e) => {
    let points = parseInt(e.target.value, 10) || 0;
    points = Math.min(points, user.point);
    points = Math.min(points, totalPrice);
    setPointUsage(points);
    setFinalPrice(totalPrice - points);
    setCanPurchase(points >= totalPrice); // 총 상품 가격만큼 포인트가 입력되었을 때 버튼 활성화
  };

  const handleUseAllPoints = () => {
    const pointsToUse = Math.min(user.point, totalPrice);
    setPointUsage(pointsToUse);
    setFinalPrice(totalPrice - pointsToUse);
    setCanPurchase(pointsToUse >= totalPrice); // 모두 사용 시 버튼 활성화
  };

  const handleReservation = async () => {
    const orderData = {
      cartId: 'dummy_cart_id',
      userId: user.id,
      postNum: 12345,
      address: orderInfo.receiverAddress,
      addressDetail: '상세 주소',
      phoneNumber: orderInfo.receiverPhone,
      pointUsage,
      bundles, // 주문된 상품들
      subscriptionPeriods, // 구독 기간
      totalPrice, // 총 가격
      orderDate: new Date().toLocaleString(), // 날짜와 시간을 모두 포함한 문자열
    };

    try {
      const response = await fetch('http://localhost:8888/shop/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // 주문 내역을 localStorage에 저장
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
      orderHistory.push(orderData);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      // 차감된 포인트를 계산하여 Redux 상태 업데이트
      const deletedPoint = user.point - pointUsage;
      dispatch(userEditActions.updateUserDetail({ ...user, point: deletedPoint }));

      setModalMessage("결제가 완료되었습니다.");
      setIsConfirmStep(false);
    } catch (error) {
      console.error('Error creating order:', error);
      setModalMessage("결제에 실패했습니다.");
      setIsConfirmStep(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isConfirmStep === false) {
      navigate('/treats');
    }
  };

  return (
    <div className={styles['order-page-container']}>
      <h1>결제 확인</h1>
      <OrderInfo
        user={user}
        orderInfo={orderInfo}
        handlePhoneNumberChange={handlePhoneNumberChange}
        handleAddressChange={handleAddressChange}
        handleAddressSearch={handleAddressSearch}
      />
      <ProductInfo
        bundles={bundles}
        subscriptionPeriodLabels={subscriptionPeriodLabels}
        subscriptionPeriods={subscriptionPeriods}
      />
      <PaymentInfo
        totalPrice={totalPrice}
        pointUsage={pointUsage}
        finalPrice={finalPrice}
        handlePaymentMethodClick={handlePaymentMethodClick}
        showPointPayment={showPointPayment}
        handlePointChange={handlePointChange}
        handleUseAllPoints={handleUseAllPoints}
        user={user}
      />
      <button onClick={handleSubmit} disabled={!canPurchase}>
        결제하기
      </button>
      {showModal && (
        <OrderModal
          title={isConfirmStep ? "결제 확인" : "알림"}
          message={modalMessage}
          onConfirm={isConfirmStep ? handleReservation : handleCloseModal}
          onClose={handleCloseModal}
          confirmButtonText={isConfirmStep ? "예" : "확인"}
          showCloseButton={isConfirmStep}
        />
      )}
    </div>
  );
};

export default OrderPage;
