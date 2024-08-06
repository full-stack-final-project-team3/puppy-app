import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const OrderPage = () => {
  const user = useSelector((state) => state.userEdit.userDetail);

  const [orderInfo, setOrderInfo] = useState({
    buyerPhone: user.phoneNumber || '', // 사용자의 전화번호를 초기 값으로 설정하거나 빈 문자열
    receiverName: user.nickname || '', // 사용자 닉네임
    receiverPhone: user.phoneNumber || '', // 사용자 전화번호
    receiverAddress: user.address || '', // 사용자 주소
    productName: '크리스피 눈꽃 허니쌀과자 개별포장 대용량 100개입',
    productWeight: '32g',
    quantity: 1,
    price: 18990,
    discount: 4600,
    shippingCost: 2500,
    points: 0,
    deliveryRequest: '문 앞', // 기본 배송 요청 사항 설정
  });

  const calculateTotal = () => {
    return orderInfo.price - orderInfo.discount + orderInfo.shippingCost;
  };

  const handleDeliveryRequestChange = (event) => {
    setOrderInfo({ ...orderInfo, deliveryRequest: event.target.value });
  };

  const handleAddressChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverAddress: event.target.value });
  };

  const handlePhoneNumberChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverPhone: event.target.value });
  };

  // 카카오 주소 검색 함수
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function(data) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        // 주소 상태 업데이트
        setOrderInfo({ ...orderInfo, receiverAddress: fullAddress });
      }
    }).open();
  };

  return (
    <div>
      <h1>구매자 정보</h1>
      <p>이름: {user.nickname}</p>
      <p>이메일: {user.email}</p>
      <div>
        <label>휴대폰 번호: </label>
        {user.phoneNumber ? (
          <p>{user.phoneNumber}</p>
        ) : (
          <input
            type="text"
            value={orderInfo.receiverPhone}
            onChange={handlePhoneNumberChange}
            placeholder="휴대폰 번호 입력"
            required
          />
        )}
      </div>

      <h1>받는 사람 정보</h1>
      <p>이름: {orderInfo.receiverName}</p>
      <div>
        <label>휴대폰 번호: </label>
        {user.phoneNumber ? (
          <p>{user.phoneNumber}</p>
        ) : (
          <input
            type="text"
            value={orderInfo.receiverPhone}
            onChange={handlePhoneNumberChange}
            placeholder="휴대폰 번호 입력"
            required
          />
        )}
      </div>
      {/* <p>주소: {orderInfo.receiverAddress}</p> */}
      <div>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={orderInfo.receiverAddress}
          onChange={handleAddressChange}
          required
          disabled
        />
        <button onClick={handleAddressSearch}>주소 검색</button>
      </div>
      <div>
        <input placeholder='나머지 주소를 입력해'/>
      </div>

      <h1>배송 정보</h1>
      <p>배송 요청 사항:</p>
      <select value={orderInfo.deliveryRequest} onChange={handleDeliveryRequestChange}>
        <option value="문 앞">문 앞</option>
        <option value="직접 받고 부재 시 문 앞">직접 받고 부재 시 문 앞</option>
        <option value="경비실">경비실</option>
        <option value="택배함">택배함</option>
        <option value="기타사항">기타사항</option>
      </select>

      <h1>상품 정보</h1>
      <h2>상품명: {orderInfo.productName}</h2>
      <p>패키지에서 고른거 1</p>
      <p>패키지에서 고른거 2</p>
      <p>패키지에서 고른거 3</p>
      <p>패키지에서 고른거 4</p>
      <p>패키지에서 고른거 5</p>
      <p>무게: {orderInfo.productWeight}</p>
      <p>수량: {orderInfo.quantity}</p>

      <h1>결제 정보</h1>
      <p>총 상품 가격: {orderInfo.price}원</p>
      <p>배송비: {orderInfo.shippingCost}원</p>
      <p>현재 포인트: {user.point}원</p>
      <p>결제 금액: {calculateTotal()}원</p>
    </div>
  );
};

export default OrderPage;
