import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import styles from "./Home.module.scss"; // Import the SCSS module
import { PulseLoader } from "react-spinners";
import spinnerStyles from "../layout/user/Spinner.module.scss";

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import MarqueeBanner from "./hotel/MarqueeBanner";
import { NavItem } from "reactstrap";

const Home = () => {
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);

  const [adImage1, setAdImage1] = useState("/main_ad/메인2.png");
  const [adImage2, setAdImage2] = useState("/main_ad/메인1.png");
  const [adImage3, setAdImage3] = useState("/main_ad/메인3.png");

  // 스피너 상태 관리
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 비디오 재생 관련
  useEffect(() => {
    const playVideos = () => {
      if (window.innerWidth >= 400 && document.visibilityState === "visible") {
        videoRef1.current?.play().catch(() => {}); // 오류 무시
        videoRef2.current?.play().catch(() => {}); // 오류 무시
        videoRef3.current?.play().catch(() => {}); // 오류 무시
      }
    };

    // 비디오 멈추기
    const pauseVideos = () => {
      videoRef1.current?.pause();
      videoRef2.current?.pause();
      videoRef3.current?.pause();
    };

    // 반응형 비디오 조작
    const handleResize = () => {
      if (window.innerWidth < 400) {
        pauseVideos();
      } else {
        playVideos();
      }
    };

    // 반응형으로 비디오 표시 설정
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pauseVideos();
      } else if (document.visibilityState === "visible") {
        playVideos(); // 페이지 활성화 시 비디오 재생
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 컴포넌트가 처음 마운트될 때 비디오 상태 설정
    handleResize();

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 화면 크기에 따라 이미지 변경
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 420) {
        setAdImage1("/main_ad/메인반응1.png");
        setAdImage2("/main_ad/메인반응2.png");
        setAdImage3("/main_ad/메인반응3.png");
      } else {
        setAdImage1("/main_ad/메인1.png");
        setAdImage2("/main_ad/메인2.png");
        setAdImage3("/main_ad/메인3.png");
      }
    };

    // 초기 로드 시 이미지 설정
    handleResize();

    // 윈도우 리사이즈 시 이미지 변경
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 알아보기 버튼 스피너 설정
  const handleNavClick = async (path) => {
    setLoading(true); // 로딩 시작
    try {
      // 비동기 작업 또는 페이지 로딩 처리
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 실제 비동기 작업으로 대체 가능
      navigate(path); // 페이지 이동
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handleNavigate = async (path) => {
    setLoading(true); // 로딩 시작
    try {
      // 비동기 작업 또는 페이지 로딩 처리
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 실제 비동기 작업으로 대체 가능
      navigate(path);
    } finally {
      setLoading(false); // 로딩 종료
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinnerWrapper}>
            <div className={spinnerStyles.spinnerContainer}>
              <PulseLoader
                className={spinnerStyles.loader}
                color="#0B593F"
                loading={loading}
                size={18}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.homeContainer}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0} // Adjusted to ensure no extra space between slides
          pagination={{ clickable: false }}
          navigation={false}
          autoplay={{ delay: 5000, disableOnInteraction: false }} // Added autoplay configuration
          loop // Added loop to make it infinite
          className={styles.mySwiper}
        >
          <SwiperSlide className={styles.swiperSlide}>
            <div className={styles.slideContent}>
              <div className={styles.textBox}>
                <h1>반려견을 위한 최적의 음식들만 담아보세요.</h1>
                <p>맞춤형 펫 푸드, 정기 배송, 할인 모두 한번에</p>
                <NavItem
                  onClick={() => handleNavClick("/treats")}
                  className={styles.getStartedBtn}
                >
                  알아보기
                </NavItem>
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
                <h1>가까운 애견 호텔, 간편하게 검색하고 예약하세요!</h1>
                <p>반려견 호텔 예약, 쉽고 빠르게!</p>
                <NavItem
                  onClick={() => handleNavClick("/hotel")}
                  className={styles.getStartedBtn}
                >
                  알아보기
                </NavItem>
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
                <h1>Doggle 커뮤니티</h1>
                <p>함께하는 즐거움, 커뮤니티의 힘!</p>
                <NavItem
                  onClick={() => handleNavClick("/board")}
                  className={styles.getStartedBtn}
                >
                  알아보기
                </NavItem>
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
        <MarqueeBanner className={styles.Banner} />
      </div>
      <div className={styles.adContainer}>
        <div className={styles.adBox}>
          <img
            className={styles.ad}
            src={adImage1}
            onClick={() => handleNavigate("/hotel")}
            alt="메인2"
          />
        </div>
        <div className={styles.adBox}>
          <img
            className={styles.ad}
            src={adImage2}
            onClick={() => handleNavigate("/board")}
            alt="메인1"
          />
        </div>
        <div className={styles.adBox}>
          <img
            className={styles.ad}
            src={adImage3}
            onClick={() => handleNavigate("/treats")}
            alt="메인3"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
