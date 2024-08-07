import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const OrderPage = () => {
  const user = useSelector((state) => state.userEdit.userDetail);

  const [orderInfo, setOrderInfo] = useState({
    buyerPhone: user.phoneNumber || '',
    receiverName: user.nickname || '',
    receiverPhone: user.phoneNumber || '',
    receiverAddress: user.address || '',
    bundleTitle: '',
    bundlePrice: 0,
  });

  const [remainingPoints, setRemainingPoints] = useState(0);
  const [canPurchase, setCanPurchase] = useState(false);

  useEffect(() => {
    const remainingPoints = user.point - orderInfo.bundlePrice;
    setRemainingPoints(remainingPoints);
    setCanPurchase(remainingPoints >= 0);
  }, [user.point, orderInfo.bundlePrice]);

  const handleAddressChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverAddress: event.target.value });
  };

  const handlePhoneNumberChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverPhone: event.target.value });
  };

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
            extraAddress += (extraAddress !== '' ? `, ${extraAddress}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setOrderInfo({ ...orderInfo, receiverAddress: fullAddress });
      }
    }).open();
  };

  const handleSubmit = () => {
    const orderData = {
      cartId: 'dummy_cart_id',
      userId: user.id,
      postNum: 12345,
      address: orderInfo.receiverAddress,
      addressDetail: '상세 주소',
      phoneNumber: orderInfo.receiverPhone,
    };

    fetch('http://localhost:8888/shop/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(data => {
        alert('주문이 성공적으로 완료되었습니다!');
        console.log('Order created:', data);
        setOrderInfo(prevOrderInfo => ({
          ...prevOrderInfo,
          bundleTitle: data.bundle.bundleTitle,
          bundlePrice: data.bundle.bundlePrice
        }));
      })
      .catch(error => {
        console.error('Error creating order:', error);
        alert('주문 생성에 실패했습니다.');
      });
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
      <select>
        <option value="문 앞">문 앞</option>
        <option value="직접 받고 부재 시 문 앞">직접 받고 부재 시 문 앞</option>
        <option value="경비실">경비실</option>
        <option value="택배함">택배함</option>
        <option value="기타사항">기타사항</option>
      </select>

      <h1>상품 정보</h1>
      <h3>상품명: {orderInfo.bundleTitle}</h3>
      <p>패키지 리스트 1</p>
      <p>패키지 리스트 2</p>
      <p>패키지 리스트 3</p>
      <p>패키지 리스트 4</p>
      <p>패키지 리스트 5</p>

      <h1>결제 정보</h1>
      <p>총 상품 가격: {orderInfo.bundlePrice}원</p>
      <p>현재 포인트: {user.point}원</p>
      <p>남은 포인트: {remainingPoints}원</p>

      <button onClick={handleSubmit} disabled={!canPurchase}>결제하기</button>
    </div>
  );
};

export default OrderPage;
