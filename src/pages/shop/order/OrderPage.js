import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { userEditActions } from '../../../components/store/user/UserEditSlice';
import styles from './scss/OrderPage.module.scss';
import OrderModal from './OrderModal';
import OrderInfo from './OrderInfo';
import ProductInfo from './ProductInfo';
import PaymentInfo from './PaymentInfo';
import { SHOP_URL } from '../../../config/user/host-config';

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
    buyerPhone: user.phoneNumber,
    receiverName: user.realName,
    receiverPhone: user.phoneNumber,
    receiverAddress: user.address,
    receiverDetailAddress: user.detailAddress, // 추가: 상세 주소
    deliveryRequest: '',  // 여기서 초기 상태가 빈 문자열로 설정되어 있는지 확인
    customRequest: '', 
  });


  // 배송 요청 사항 업데이트 함수 추가
  const handleDeliveryMemoChange = (event) => {
    setOrderInfo({ ...orderInfo, deliveryMemo: event.target.value });
  };

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
    setCanPurchase(false);

    console.log('user: '+ user);
    console.log(user);
    console.log(orderInfo);
  }, [user.point, totalPrice]);

  const handlePhoneNumberChange = (event) => {
    setOrderInfo({ ...orderInfo, buyerPhone: event.target.value });
  };

  const handleReceiverPhoneNumberChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverPhone: event.target.value });
  };

  const handlePhoneNumberUpdate = () => {
    dispatch(userEditActions.updateUserDetail({
      ...user,
      phoneNumber: orderInfo.receiverPhone
    }));
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

  const handleDeliveryRequestChange = (event) => {
    setOrderInfo({ ...orderInfo, deliveryRequest: event.target.value });
    
    // if (event.target.value !== '기타사항') {
    //   setOrderInfo({ ...orderInfo, customRequest: '' }); // "기타사항"이 아닌 다른 옵션을 선택할 경우, 기존의 "기타사항" 내용을 초기화
    // }
  };

  const handleCustomRequestChange = (event) => {
    setOrderInfo({ ...orderInfo, customRequest: event.target.value });
  };

  const handleReceiverInfoUpdate = (name, phone, address, detailAddress) => {
    setOrderInfo({
      ...orderInfo,
      receiverName: name,
      receiverPhone: phone,
      receiverAddress: address,
      receiverDetailAddress: detailAddress,
    });
  };

  const handleUserInfoUpdate = (name, phone) => {
    dispatch(userEditActions.updateUserDetail({
      ...user,
      realName: name,
      phoneNumber: phone,
    }));
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
    setCanPurchase(points >= totalPrice);
  };

  const handleUseAllPoints = () => {
    const pointsToUse = Math.min(user.point, totalPrice);
    setPointUsage(pointsToUse);
    setFinalPrice(totalPrice - pointsToUse);
    setCanPurchase(pointsToUse >= totalPrice);
  };

  const handleReservation = async () => {
    const orderData = {
      // cartId: 'dummy_cart_id',
      userId: user.id,
      postNum: 12345,
      receiverName: orderInfo.receiverName,
      receiverPhone: orderInfo.receiverPhone,
      address: orderInfo.receiverAddress,
      addressDetail: orderInfo.receiverDetailAddress,
      deliveryRequest: orderInfo.deliveryRequest, // 배송 요청 사항 전달
      customRequest: orderInfo.customRequest,  // 기타 요청 사항 전달
      pointUsage,
      bundles,
      subscriptionPeriods,
      totalPrice,
      orderDate: new Date().toLocaleString(),
    };

    console.log("Order Data:", orderData); // 로그를 통해 확인
    
    try {

      const response = await fetch(`${SHOP_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const createdOrder = await response.json();
      const deletedPoint = user.point - pointUsage;
      dispatch(userEditActions.updateUserDetail({ ...user, point: deletedPoint }));

      navigate('/order-detail', {
        state: {
          order: createdOrder, // 이 객체에 deliveryRequest가 제대로 포함되어 있는지 확인
          orderInfo: orderInfo,
        },
      });

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
        handleReceiverInfoUpdate={handleReceiverInfoUpdate}
        handleUserInfoUpdate={handleUserInfoUpdate}
        handleDeliveryRequestChange={handleDeliveryRequestChange}
        handleCustomRequestChange={handleCustomRequestChange}
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
