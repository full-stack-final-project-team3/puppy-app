import React, { useState } from 'react';
import styles from './scss/OrderPage.module.scss';
import EditInfoModal from './EditInfoModal';
import EditUserInfoModal from './EditUserInfoModal';

const OrderInfo = ({
  user,
  orderInfo,
  handleReceiverInfoUpdate,
  handleUserInfoUpdate,
  handleDeliveryRequestChange,  // 부모 컴포넌트로부터 전달받은 함수
  handleCustomRequestChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null); // 모달창의 용도 구분

  const handleSave = (newName, newPhone, address, detailAddress) => {
    if (editingType === 'user') {
      handleUserInfoUpdate(newName, newPhone); // 구매자 정보 수정
    } else if (editingType === 'receiver') {
      handleReceiverInfoUpdate(newName, newPhone, address, detailAddress); // 받는 사람 정보 수정
    }
    setShowModal(false); // 모달 닫기
  };

  return (
    <div>
      <div className={styles.section}>
        <div className={styles['section-title']}>
          구매자 정보
          <button onClick={() => { setShowModal(true); setEditingType('user'); }}>
            구매자 정보 수정
          </button>
        </div>
        <div className={styles['section-content']}>
          <p>이름: {user.realName || '정보 없음'}</p>
          <p>이메일: {user.email || '정보 없음'}</p>
          <p>연락처: {user.phoneNumber || '정보 없음'}</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles['section-title']}>
          받는 사람 정보
          <button onClick={() => { setShowModal(true); setEditingType('receiver'); }}>
            받는 사람 정보 수정
          </button>
        </div>
        <div className={styles['section-content']}>
          <p>이름: {orderInfo.receiverName || '정보 없음'}</p>
          <p>연락처: {orderInfo.receiverPhone || '정보 없음'}</p>
          <p>주소: {orderInfo.receiverAddress || '정보 없음'}</p>
          <p>상세 주소: {orderInfo.receiverDetailAddress || user.detailAddress}</p> {/* 상세 주소 출력 추가 */}
          <p>배송 요청 사항:</p>
          <select
            value={orderInfo.deliveryRequest}
            onChange={handleDeliveryRequestChange}  // 이곳에서 handleDeliveryRequestChange 함수를 사용
            required
          >
            <option value="문앞">문 앞</option>
            <option value="직접">직접 받고 부재 시 문 앞</option>
            <option value="경비실">경비실</option>
            <option value="택배함">택배함</option>
            <option value="기타사항">기타사항</option>
          </select>

          {orderInfo.deliveryRequest === '기타사항' && (
            <div className={styles.customRequest}>
              <input
                type="text"
                placeholder="기타 요청 사항을 입력하세요"
                value={orderInfo.customRequest}
                onChange={handleCustomRequestChange}
                required
              />
            </div>
          )}
        </div>
      </div>

      {showModal && editingType === 'user' && (
        <EditUserInfoModal
          name={user.realName}
          phone={user.phoneNumber}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && editingType === 'receiver' && (
        <EditInfoModal
          receiverName={orderInfo.receiverName}
          receiverPhone={orderInfo.receiverPhone}
          receiverAddress={orderInfo.receiverAddress}
          receiverDetailAddress={orderInfo.receiverDetailAddress} // 상세 주소를 넘겨줍니다
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default OrderInfo;
