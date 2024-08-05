import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './HotelRecords.module.scss'

const HotelRecords = () => {

    // 호텔 예약 내역 조회 페이지

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 예약한 호텔~
            </div>
        </div>
    );
};

export default HotelRecords;