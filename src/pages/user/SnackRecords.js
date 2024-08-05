import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './SnackRecords.module.scss'

const SnackRecords = () => {

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 구매한 간식들~
            </div>
        </div>
    );
};

export default SnackRecords;