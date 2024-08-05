import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyBoards.module.scss'

const MyBoards = () => {

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}>
                내가 적은 게시글~
            </div>
        </div>
    );
};

export default MyBoards;