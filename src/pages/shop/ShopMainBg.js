import React from "react";
import styles from "./ShopMainBg.module.scss";
import Footer from "../../layout/user/Footer";

const Slider = () => {
  const slides = [
    { className: "slide1", text: "CRAFTED IN US FACILITIES" },
    { className: "slide2", text: "MINIMAL PROCESSING" },
    { className: "slide3", text: "HUMAN-GRADE" },
    { className: "slide4", text: "NO FILLERS" },
    { className: "slide5", text: "NO ARTIFICIAL FLAVORS" },
  ];

  const slideCount = slides.length; 
  const duplicatedSlides = [
    ...slides,
    ...slides,
    ...slides,
    ...slides,
    ...slides,
    ...slides,
    ...slides,
  ]; 

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        {duplicatedSlides.map((slide, index) => (
          <div className={styles.slideImgBox} key={index}>
            <div className={`${styles.slide} ${styles[slide.className]}`}></div>
            <div className={styles.slideText}>{slide.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ShopMainBg = ({ content, manageShopBtn }) => {
  return (
    <>
      <div className={styles.mainSection}>
        <div className={styles.imgSection}>
          <div className={styles.manageShopBtn}>{manageShopBtn}</div>
        </div>
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
                강아지의 정보와 취향을 입력하면 강아지에 최적화된 펫 푸드를 매월
                정기 배달합니다.
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
                최고의 원재료, 신뢰할 수 있는 브랜드의 까다로운<br></br>선별을
                통해 강아지와 나, 모두 안심할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
        <div className={styles.imgSection3Box}>
          <div className={styles.processContainer}>
            <div className={styles.processContent}>
              <h2 className={styles.processTitle}>PROCESS</h2>
              <div className={styles.processStep}>
                <span className={styles.stepNumber}>✔️</span>
                <div className={styles.stepContent}>
                  <h4 className={styles.processName}>
                    강아지 정보를 입력하기
                    <span className={styles.stepIcon1}></span>
                  </h4>
                  <p>
                    몇 가지 간단한 질문을 통해 우리에게 강아지를 소개해주세요!
                  </p>
                </div>
              </div>
              <div className={styles.processStep}>
                <span className={styles.stepNumber}>✔️</span>
                <div className={styles.stepContent}>
                  <h4 className={styles.processName}>
                    간식 고르기 <span className={styles.stepIcon2}></span>
                  </h4>
                  <p>
                    강아지 정보를 분석하여 추천한 몇 가지 상품 중 원하는 걸
                    선택해주세요!
                  </p>
                </div>
              </div>
              <div className={styles.processStep}>
                <span className={styles.stepNumber}>✔️</span>
                <div className={styles.stepContent}>
                  <h4 className={styles.processName}>
                    월 정기 배송<span className={styles.stepIcon3}></span>
                  </h4>
                  <p>선택한 정보를 바탕으로 강아지에게 매월 선물이 배송돼요!</p>
                </div>
              </div>
              <div className={styles.content}>{content}</div>
            </div>
          </div>
          <div className={styles.imgSection3}> </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ShopMainBg;
