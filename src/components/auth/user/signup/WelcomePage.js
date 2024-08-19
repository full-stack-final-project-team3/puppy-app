// WelcomePage.js
import React from "react";
import styles from './WelcomePage.module.scss'; // 스타일링을 위한 CSS 파일

const WelcomePage = ({ onAddDogClick }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.welcomeContainer}>
        <div className={styles.welcomeCard}>
          <div className={styles.topSection}>
            <span className={styles.iconPlaceholder}>@DOOGLE</span>
            <nav className={styles.navLinks}>
              <a href="/hotel">HOTEL</a>
              <a href="/treats">SHOP</a>
              <a href="/board">COMMUNITY</a>
            </nav>
          </div>
          
          <h1 className={styles.welcomeTitle}>Welcome</h1>
          <p className={styles.welcomeText}>
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
            onClick={onAddDogClick}
          >
            ADD DOG
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
