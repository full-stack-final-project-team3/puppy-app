import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyReviews.module.scss'

const MyReviews = () => {

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 쓴 리뷰들~
            </div>
        </div>
    );
};

export default MyReviews;