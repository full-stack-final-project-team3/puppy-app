import React from 'react';
import styles from './DetailAboutReservation.module.scss'
import MyPageHeader from "../auth/user/mypage/MyPageHeader";

const DetailAboutReservation = () => {
    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                호텔 예약 상세조회 페이지 입니다
            </div>
        </div>
    );
};

export default DetailAboutReservation;