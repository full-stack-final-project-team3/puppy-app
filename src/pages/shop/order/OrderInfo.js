import React, { useState } from 'react';
import styles from './scss/OrderPage.module.scss';
import EditInfoModal from './EditInfoModal';
import EditUserInfoModal from './EditUserInfoModal';

const OrderInfo = ({
  user,
  orderInfo,
  handleReceiverInfoUpdate,
  handleUserInfoUpdate,
  handleDeliveryRequestChange,
  handleCustomRequestChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null); // 모달창의 용도 구분

  const handleSave = (newName, newPhone, address, detailAddress) => {
    if (editingType === 'user') {
      // 구매자 정보 수정
      handleUserInfoUpdate(newName, newPhone);
      // 구매자 정보가 업데이트되면, 받는 사람 정보도 동일하게 업데이트
      handleReceiverInfoUpdate(newName, newPhone, orderInfo.receiverAddress, orderInfo.receiverDetailAddress);
    } else if (editingType === 'receiver') {
      // 받는 사람 정보 수정
      handleReceiverInfoUpdate(newName, newPhone, address, detailAddress);
    }
    setShowModal(false); // 모달 닫기
  };

  return (
    <div>
      <div className={styles.section}>
        <div className={styles['section-title']}>
          구매자 정보
          <button onClick={() => { setShowModal(true); setEditingType('user'); }}>
            구매자 정보 입력
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
          <p>주소: {orderInfo.receiverAddress || '정보 없음'} {orderInfo.receiverDetailAddress || user.detailAddress}</p>
          {/* <p>주소: {orderInfo.receiverAddress || '정보 없음'}</p>
          <p>상세 주소: {orderInfo.receiverDetailAddress || user.detailAddress}</p> */}
          <p>배송 요청 사항:</p>
          <select
            value={orderInfo.deliveryRequest}
            onChange={handleDeliveryRequestChange}
            required
          >
            <option value="선택 안 함">선택 안 함</option>
            <option value="직접 받고 부재 시 문 앞">직접 받고 부재 시 문 앞</option>
            <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
            <option value="부재 시 연락 부탁드려요">부재 시 연락 부탁드려요</option>
            <option value="배송 전 미리 연락해 주세요">배송 전 미리 연락해 주세요</option>
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
          receiverDetailAddress={orderInfo.receiverDetailAddress}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default OrderInfo;
