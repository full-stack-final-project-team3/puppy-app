import React from 'react';
import styles from './AboutMyInfo.module.scss';
import { FaHotel, FaBone, FaHeart, FaPen, FaBookmark, FaStar } from 'react-icons/fa';
import {Link} from "react-router-dom";

const AboutMyInfo = () => {



    return (
        <div className={styles.wrap}>
            <div className={styles.secondWrap}>
                <div className={styles.title}>My Info</div>
                <div className={styles.subWrap}>
                    <Link to={'/hotel-record'} className={styles.suggest}>
                        <FaHotel className={styles.hotelIcon}/>
                        호텔 예약 내역
                    </Link>
                    <Link to={'/snack-record'} className={styles.suggest}>
                        <FaBone className={styles.snackIcon}/>
                        펫 푸드 구독 내역
                    </Link>
                </div>
                <div className={styles.subWrap}>
                    <Link to={'/like-hotel'} className={styles.suggest}>
                        <FaBookmark className={styles.bookmarkIcon}/>
                        즐겨찾기 한 호텔
                    </Link>
                    <Link to={'/like-boards'} className={styles.suggest}>
                        <FaHeart className={styles.heartIcon}/>
                        좋아요 누른 글
                    </Link>
                </div>
                <div className={styles.subWrap}>
                    <Link to={'/my-boards'} className={styles.suggest}>
                        <FaPen className={styles.penIcon}/>
                        내가 쓴 글
                    </Link>
                    <Link to={'/my-reviews'} className={styles.suggest}>
                        <FaPen className={styles.starIcon}/>
                        내 리뷰
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutMyInfo;