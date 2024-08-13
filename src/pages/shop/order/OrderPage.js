import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useLocation } from 'react-router-dom';
import styles from './OrderPage.module.scss';
import {NOTICE_URL} from "../../../config/user/host-config";
import {userEditActions} from "../../../components/store/user/UserEditSlice";
import treatsDetail from "../TreatsDetail";
import treatsDetailContent from "../TreatsDetailContent"; // 추가된 라인

const OrderPage = () => {
  const user = useSelector((state) => state.userEdit.userDetail);
  const location = useLocation();
  const { bundles, subscriptionPeriods, totalPrice } = location.state;
  const dispatch = useDispatch();

  console.log(user)
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

  const [remainingPoints, setRemainingPoints] = useState(0);
  const [canPurchase, setCanPurchase] = useState(false);

  useEffect(() => {
    const remainingPoints = user.point - totalPrice;
    setRemainingPoints(remainingPoints);
    setCanPurchase(remainingPoints >= 0);
  }, [user.point, totalPrice]);

  const handleAddressChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverAddress: event.target.value });
  };

  const handlePhoneNumberChange = (event) => {
    setOrderInfo({ ...orderInfo, receiverPhone: event.target.value });
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
            return response.text().then(text => {
              throw new Error(text)
            });
          }
          return response.json();
        })
        .then(async data => {
          try {
            const noticePayload = {
              userId: user.id,
              message: `'강아지 맞춤 간식 패키지' 주문 성공!`
            };

            const noticeResponse = await fetch(`${NOTICE_URL}/add`, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(noticePayload)
            });

            if (!noticeResponse.ok) {
              const errorText = await noticeResponse.text();
              throw new Error(`Failed to send notice: ${errorText}`);
            }

            const newNotice = await noticeResponse.json();

            dispatch(userEditActions.addUserNotice(newNotice));

            const updatedUserDetailWithNoticeCount = {
              ...user,
              noticeCount: user.noticeCount + 1
            };

            dispatch(userEditActions.updateUserDetail(updatedUserDetailWithNoticeCount));

            alert('주문이 성공적으로 완료되었습니다!');
            console.log('Order created:', data);

            setOrderInfo(prevOrderInfo => ({
              ...prevOrderInfo,
            }));

          } catch (noticeError) {
            console.error('Error sending notice:', noticeError);
            alert('주문은 성공했지만 알림 생성에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error('Error creating order:', error);
          alert('주문 생성에 실패했습니다.');
        });
  }

  return (
    <div className={styles['order-page-container']}>
      <h1>결제 확인</h1>

      <div className={styles.section}>
        <div className={styles['section-title']}>구매자 정보</div>
        <div className={styles['section-content']}>
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
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles['section-title']}>받는 사람 정보</div>
        <div className={styles['section-content']}>
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
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles['section-title']}>배송 정보</div>
        <div className={styles['section-content']}>
          <p>배송 요청 사항:</p>
          <select>
            <option value="문 앞">문 앞</option>
            <option value="직접 받고 부재 시 문 앞">직접 받고 부재 시 문 앞</option>
            <option value="경비실">경비실</option>
            <option value="택배함">택배함</option>
            <option value="기타사항">기타사항</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles['section-title']}>상품 정보</div>
        <div className={styles['section-content']}>
          {bundles.map((bundle) => (
            <div key={bundle.id}>
              <h3>상품명: 반려견 전용 맞춤형 푸드 패키지 For {bundle.dogName}</h3>
              <p>상품 구독 기간 : {subscriptionPeriodLabels[subscriptionPeriods[bundle.id]]}</p>
              <div>
                <p>패키지 리스트 </p>
                {bundle.treats.map((treat) => (
                  <p key={treat.id}>▶ {treat.treatsTitle}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles['section-title']}>결제 정보</div>
        <div className={styles['section-content']}>
          <p>총 상품 가격: {totalPrice.toLocaleString()}원</p>
          <p>현재 포인트 : {user.point}원</p>
          <p>포인트 결제 차감: -{(user.point - remainingPoints).toLocaleString()}원</p>
          <p>최종 결제 금액: {remainingPoints.toLocaleString()}원</p>
        </div>
      </div>

      <div className={styles['payment-methods']}>
        <button>무통장입금</button>
        <button>신용카드</button>
        <button>가상계좌</button>
        <button>계좌이체</button>
        <button>포인트</button>
      </div>

      <button onClick={handleSubmit} disabled={!canPurchase}>
      결제하기
      </button>
    </div>
  );
};

export default OrderPage;
