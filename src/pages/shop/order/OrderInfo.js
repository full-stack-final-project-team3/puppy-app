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
  setValidationErrors, // 추가: validation 에러 전달을 위한 함수
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState(null); // 모달창의 용도 구분

  const validateFields = () => { // 추가: 필드 검증 함수
    const errors = {};
    if (!orderInfo.receiverName) {
      errors.receiverName = '이름을 입력해 주세요.';
    }
    if (!orderInfo.receiverPhone) {
      errors.receiverPhone = '연락처를 입력해 주세요.';
    }
    if (!orderInfo.receiverAddress || !orderInfo.receiverDetailAddress) {
      errors.receiverAddress = '주소를 입력해 주세요.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
        <div className={`${styles['section-title']} ${styles.ouser_order_info_modify}`}>
          받는 사람 정보
          <button className={styles.order_info_btn} onClick={() => { setShowModal(true); setEditingType('receiver'); }}>
            <span className={styles.transition} ></span>
            <span className={styles.gradient} ></span>
            <span className={styles.labels} >입력</span>
          </button>
        </div>
        <div className={`${styles['section-content']} ${styles.ouser_order_info}`}>
          <p><span>이름:  </span>{orderInfo.receiverName || '정보 없음'}</p>
          <p><span>연락처: </span>{orderInfo.receiverPhone || '정보 없음'}</p>
          <p><span>주소: </span>{orderInfo.receiverAddress || '정보 없음'} {orderInfo.receiverDetailAddress || user.detailAddress}</p>
          <select
            className={styles.custom_select}
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
