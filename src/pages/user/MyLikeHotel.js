import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeHotel.module.scss'

const MyLikeHotel = () => {

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 찜해놓은 호텔~
            </div>
        </div>
    );
};

export default MyLikeHotel;