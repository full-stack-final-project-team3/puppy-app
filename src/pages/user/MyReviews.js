import React, { useState } from "react";
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from "./MyReviews.module.scss";
import HotelReview from "./HotelReview";
import SnackReview from "./SnackReview";
import Footer from "../../layout/user/Footer";

const MyReviews = () => {
  const [clickedSnack, setClickedSnack] = useState(true);
  const [clickedHotel, setClickedHotel] = useState(false);

  const renderSnackHandler = () => {
    setClickedSnack(true);
    setClickedHotel(false);
  };
  const renderHotelHandler = () => {
    setClickedSnack(false);
    setClickedHotel(true);
  };

  return (
    <>
      <div className={styles.wrap}>
        <MyPageHeader />
        <div className={styles.subWrap}>
          <div className={styles.header}>
            <span className={styles.menu} onClick={renderSnackHandler}>
              Shop
            </span>
            <span className={styles.menu} onClick={renderHotelHandler}>
              Hotel
            </span>
          </div>
          <hr className={styles.hr} />
          {clickedSnack && <SnackReview />}
          {clickedHotel && <HotelReview />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyReviews;
