import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import { userEditActions } from "../../../components/store/user/UserEditSlice";
import styles from "./scss/OrderPage.module.scss";
import OrderInfo from "./OrderInfo";
import ProductInfo from "./ProductInfo";
import PaymentInfo from "./PaymentInfo";
import { SHOP_URL } from "../../../config/user/host-config";

const OrderPage = () => {
  const user = useSelector((state) => state.userEdit.userDetail);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartId, bundles, subscriptionPeriods, totalPrice } = location.state;

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
    receiverDetailAddress: user.detailAddress,
    deliveryRequest: "",
    customRequest: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [remainingPoints, setRemainingPoints] = useState(user.point);
  const [canPurchase, setCanPurchase] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isConfirmStep, setIsConfirmStep] = useState(true);
  const [showPointPayment, setShowPointPayment] = useState(false);
  const [pointUsage, setPointUsage] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice); // 20240821: finalPrice를 totalPrice로 초기 설정

  useEffect(() => {
    const remaining = user.point - totalPrice;
    setRemainingPoints(remaining);
    setFinalPrice(totalPrice); // 20240821: finalPrice를 totalPrice로 초기화
    setCanPurchase(false);

    console.log("user: " + user);
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
    dispatch(
      userEditActions.updateUserDetail({
        ...user,
        phoneNumber: orderInfo.receiverPhone,
      })
    );
  };

  const handleAddressChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverAddress: event.target.value });
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== "" ? `, ${extraAddress}` : data.buildingName;
          }
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        setOrderInfo({ ...orderInfo, receiverAddress: fullAddress });
      },
    }).open();
  };

  const handleDeliveryRequestChange = (event) => {
    setOrderInfo({ ...orderInfo, deliveryRequest: event.target.value });
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
    dispatch(
      userEditActions.updateUserDetail({
        ...user,
        realName: name,
        phoneNumber: phone,
      })
    );
  };

  const handleSubmit = () => {
    const isValid = validateFields();
    if (!isValid) {
      setModalMessage("받는 사람 정보에 입력이 되지 않았습니다.");
      setIsConfirmStep(null);
      setShowModal(true);
      return;
    }
    if (canPurchase) {
      setModalMessage("결제를 진행하시겠습니까?");
      setIsConfirmStep(true);
      setShowModal(true);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!orderInfo.receiverName) {
      errors.receiverName = "이름을 입력해 주세요.";
    }
    if (!orderInfo.receiverPhone) {
      errors.receiverPhone = "연락처를 입력해 주세요.";
    }
    if (!orderInfo.receiverAddress || !orderInfo.receiverDetailAddress) {
      errors.receiverAddress = "주소를 입력해 주세요.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentMethodClick = (method) => {
    if (method === "point") {
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
    // setFinalPrice(totalPrice - points); // 20240821: 주석 처리하여 최종 결제 금액이 총 금액으로 유지되도록 함
    setCanPurchase(points >= totalPrice);
  };

  const handleUseAllPoints = () => {
    const pointsToUse = Math.min(user.point, totalPrice);
    setPointUsage(pointsToUse);
    // setFinalPrice(totalPrice - pointsToUse); // 20240821: 주석 처리하여 최종 결제 금액이 총 금액으로 유지되도록 함
    setCanPurchase(pointsToUse >= totalPrice);
  };

  const handleReservation = async () => {
    const orderData = {
      cartId,
      userId: user.id,
      postNum: 12345,
      receiverName: orderInfo.receiverName,
      receiverPhone: orderInfo.receiverPhone,
      address: orderInfo.receiverAddress,
      addressDetail: orderInfo.receiverDetailAddress,
      deliveryRequest: orderInfo.deliveryRequest,
      customRequest: orderInfo.customRequest,
      pointUsage,
      bundles,
      subscriptionPeriods,
      totalPrice,
      orderDate: new Date().toLocaleString(),
    };

    console.log("Order Data:", orderData);

    try {
      const response = await fetch(`${SHOP_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await response.json();
      const deletedPoint = user.point - pointUsage;
      dispatch(
        userEditActions.updateUserDetail({ ...user, point: deletedPoint })
      );

      navigate("/order-detail", {
        state: {
          order: createdOrder,
          orderInfo: orderInfo,
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      setModalMessage("결제에 실패했습니다.");
      setIsConfirmStep(false);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (isConfirmStep === false) {
      navigate("/treats");
    }
  };

  const Modal = ({ title, message, onConfirm, onClose }) => {
    return ReactDOM.createPortal(
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>{title}</h2>
          <p>{message}</p>
          <div className={styles.buttonContainer}>
            <button className={styles.confirmButton} onClick={onConfirm}>
              예
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              아니오
            </button>
          </div>
        </div>
      </div>,
      document.getElementById("root") // 20240821: 모달을 #root에 포털로 렌더링
    );
  };

  return (
    <div className={styles["order-page-container"]}>
      <h1>주문 / 결제</h1>
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
      <div className={styles.order_price_box}>
        <p>{finalPrice.toLocaleString()}</p>
        <button
          onClick={handleSubmit}
          disabled={!canPurchase}
          className={styles.order_btn}
        >
          결제하기
        </button>
      </div>
      {showModal && (
        <Modal
          title={isConfirmStep ? "결제 확인" : "알림"}
          message={modalMessage}
          onConfirm={isConfirmStep ? handleReservation : handleCloseModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderPage;
