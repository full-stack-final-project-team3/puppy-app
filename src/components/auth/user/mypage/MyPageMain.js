import React from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";

const MyPageMain = () => {
    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
        </div>
    );
};

export default MyPageMain;