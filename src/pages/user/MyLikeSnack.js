import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeSnack.module.scss'

const MyLikeSnack = () => {

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 찜해놓은 간식~
            </div>
        </div>
    );
};

export default MyLikeSnack;