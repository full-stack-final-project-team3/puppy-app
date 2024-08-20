import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from './Home.module.scss'; // Import the SCSS module

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Home = () => {

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 400) {
        // 화면이 400px보다 작아지면 비디오 정지
        videoRef1.current && videoRef1.current.pause();
        videoRef2.current && videoRef2.current.pause();
        videoRef3.current && videoRef3.current.pause();
      } else {
        // 화면이 400px보다 커지면 비디오 재생
        videoRef1.current && videoRef1.current.play();
        videoRef2.current && videoRef2.current.play();
        videoRef3.current && videoRef3.current.play();
      }
    };
    window.addEventListener('resize', handleResize);

    // 컴포넌트 마운트 시 화면 크기에 따른 초기 상태 설정
    handleResize();

    // cleanup function to remove event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
    <div className={styles.homeContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0} // Adjusted to ensure no extra space between slides
        pagination={{ clickable: false }}
        navigation= {false}
        autoplay={{ delay: 5000, disableOnInteraction: false }} // Added autoplay configuration
        loop // Added loop to make it infinite
        className={styles.mySwiper}
      >
        <SwiperSlide className={styles.swiperSlide}>
          <div className={styles.slideContent}>
            <div className={styles.textBox}>
              <h1>간식</h1>
              <p>간식 구독해라</p>
              <button className={styles.getStartedBtn}>구독하기</button>
            </div>
            <div className={styles.videoBox}>
              <video ref={videoRef1} autoPlay loop muted>
                <source src="/videos/dogseatfood.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <div className={styles.slideContent}>
            <div className={styles.textBox}>
              <h1>애견 호텔</h1>
              <p>호텔도 있음</p>
              <button className={styles.getStartedBtn}>알아 보기</button>
            </div>
            <div className={styles.videoBox}>
              <video ref={videoRef2} autoPlay loop muted>
                <source src="/videos/dogsoutdoor.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <div className={styles.slideContent}>
            <div className={styles.textBox}>
              <h1>커뮤니티</h1>
              <p>소통하세요~~</p>
              <button className={styles.getStartedBtn}>Get Started</button>
            </div>
            <div className={styles.videoBox}>
              <video ref={videoRef3} autoPlay loop muted>
                <source src="/videos/dogplaying.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
      <div className={styles.adContainer}>
        <img className={styles.ad} src="/main_ad/메인1.png"></img>
        <img className={styles.ad} src="/main_ad/메인2.png"></img>
        <img className={styles.ad} src="/main_ad/메인3.png"></img>
      </div>
    </>
  );
};

export default Home;
