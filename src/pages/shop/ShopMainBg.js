import React from "react";
import styles from "./ShopMainBg.module.scss";

const Slider = () => {
  const slides = [
    { className: "slide1", text: "CRAFTED IN US FACILITIES" },
    { className: "slide2", text: "MINIMAL PROCESSING" },
    { className: "slide3", text: "HUMAN-GRADE" },
    { className: "slide4", text: "NO FILLERS" },
    { className: "slide5", text: "NO ARTIFICIAL FLAVORS" },
  ];

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        {/* 슬라이드 내용을 두 번 반복 */}
        {[...slides, ...slides].map((slide, index) => (
          <>
            <div className={styles.slideImgBox}>
              <div
                className={`${styles.slide} ${styles[slide.className]}`}
                key={index}
              ></div>
              <div className={styles.slideText}>{slide.text}</div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

const ShopMainBg = () => {
  return (
    <div className={styles.mainSection}>
      <div className={styles.imgSection}></div>
      <Slider />
      <div className={styles.imgSection2}></div>
      <div className={styles.midSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <div className={styles.subsIcon}></div>
            <h2 className={styles.featureTitle}>
              1:1 구독
              <br />
              PLAN
            </h2>
            <p className={styles.featureContent}>
              강아지의 정보와 취향을 입력하면 강아지에 최적화된 간식을 매월 정기
              배달합니다.
            </p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.qualityIcon}></div>
            <h2 className={styles.featureTitle}>
              최상의
              <br />
              QUALITY
            </h2>
            <p className={styles.featureContent}>
              최고의 원재료, 신뢰할 수 있는 브랜드의 까다로운<br></br>선별을 통해
              강아지와 나, 모두 안심할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.imgSection3}></div>
    </div>
  );
};

export default ShopMainBg;
