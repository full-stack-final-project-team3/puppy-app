import React, { useState } from 'react';
import styles from './scss/EditUserInfoModal.module.scss';

const EditUserInfoModal = ({ name, phone, onSave, onClose }) => {
  const [newName, setNewName] = useState(name);
  const [newPhone, setNewPhone] = useState(phone);

  const handleSaveClick = () => {
    onSave(newName, newPhone, '', ''); // 주소와 상세 주소는 빈 문자열로 전달
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>구매자 정보 수정</h2>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div>
          <label>연락처</label>
          <input
            type="text"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
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

export default EditUserInfoModal;
