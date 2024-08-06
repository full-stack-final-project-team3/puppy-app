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
              <h1>Scoop up fresh nutrition</h1>
              <p>Get 60% off your first box and a FREE bag of Chicken and Apple Jerky Strips.</p>
              <button className={styles.getStartedBtn}>Get Started</button>
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
              <h1>Another headline</h1>
              <p>Some other promotional text goes here.</p>
              <button className={styles.getStartedBtn}>Get Started</button>
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
              <h1>Third headline</h1>
              <p>More promotional content in this slide.</p>
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
