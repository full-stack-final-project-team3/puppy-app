import React, { useState } from 'react';
import styles from './scss/EditInfoModal.module.scss';

const EditInfoModal = ({
  receiverName,
  receiverPhone,
  receiverAddress,
  receiverDetailAddress,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(receiverName);
  const [phone, setPhone] = useState(receiverPhone);
  const [address, setAddress] = useState(receiverAddress);
  const [detailAddress, setDetailAddress] = useState(receiverDetailAddress);

  const handleSaveClick = () => {
    onSave(name, phone, address, detailAddress);
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

        setAddress(fullAddress); // 기본 주소 업데이트
        setDetailAddress(''); // 상세 주소 초기화
      }
    }).open();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>받는 사람 정보 수정</h2>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>연락처</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label>주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 검색해 주세요"
          />
          <button type="button" onClick={handleAddressSearch}>
            주소 검색
          </button>
        </div>
        <div>
          <label>상세 주소</label>
          <input
            type="text"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="상세 주소를 입력해 주세요"
          />
        </div>
        <div className={styles.buttons}>
          <button onClick={handleSaveClick}>적용하기</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default EditInfoModal;
