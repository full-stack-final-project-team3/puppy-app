import React, { useState } from "react";
import styles from './WelcomePage.module.scss';
import UserModal from "../mypage/UserModal";

const WelcomePage = ({ onAddDogClick }) => {

  const [showModal, setShowModal] = useState(false);

  // 모달 표시 함수
  const onShowAddDogModal = () => {
    setShowModal(true);
  };

  // 모달에서 버튼 클릭 시 호출되는 함수
  const handleModalButtonClick = () => {
    setShowModal(false);
    onAddDogClick();
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.welcomeCard}>
          <div className={styles.topSection}>
            <nav className={styles.navLinks}>
              <p className={styles.text}>HOTEL</p>
              <p className={styles.text}>SHOP</p>
              <p className={styles.text}>COMMUNITY</p>
            </nav>
          </div>
          
          <h1 className={styles.title}>Welcome</h1>
          <p className={styles.text}>
            We invite you to visit our page
          </p>
          <div className={styles.btnBox}>
          <button
            type="submit"
            className={styles.button}
          >
            HOME
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={onShowAddDogModal}
          >
            ADD DOG
          </button>
          </div>
        </div>
      </div>

      {showModal && (
        <UserModal
          title="회원가입 성공"
          message="강아지 등록 페이지로 이동합니다"
          onConfirm={handleModalButtonClick}
          showCloseButton={true}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default WelcomePage;
