import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from './Home.module.scss'; // Import the SCSS module

import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const Home = () => {
  return (
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
              <video autoPlay loop muted>
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
              <video autoPlay loop muted>
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
              <video autoPlay loop muted>
                <source src="/videos/dogplaying.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Home;
