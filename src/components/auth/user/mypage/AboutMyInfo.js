import React from 'react';
import styles from './AboutMyInfo.module.scss';
import { FaHotel, FaBone, FaHeart, FaPen, FaBookmark, FaStar } from 'react-icons/fa';

const AboutMyInfo = () => {
    return (
        <div className={styles.wrap}>
            <div className={styles.subWrap}>
                <div className={styles.suggest}>
                    <FaHotel className={styles.hotelIcon} />
                    호텔 예약 내역
                </div>
                <div className={styles.suggest}>
                    <FaBone className={styles.snackIcon} />
                    간식 구독 내역
                </div>
            </div>
            <div className={styles.subWrap}>
                <div className={styles.suggest}>
                    <FaBookmark className={styles.bookmarkIcon} />
                    즐겨찾기 한 호텔
                </div>
                <div className={styles.suggest}>
                    <FaStar className={styles.starIcon} />
                    찜해놓은 간식
                </div>
            </div>
            <div className={styles.subWrap}>
                <div className={styles.suggest}>
                    <FaPen className={styles.penIcon} />
                    내가 쓴 글
                </div>
                <div className={styles.suggest}>
                    <FaHeart className={styles.heartIcon} />
                    좋아요 누른 글
                </div>
            </div>
        </div>
    );
};

export default AboutMyInfo;