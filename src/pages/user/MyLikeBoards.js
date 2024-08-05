import React from 'react';
import MyPageHeader from "../../components/auth/user/mypage/MyPageHeader";
import styles from './MyLikeBoards.module.scss'

const MyBoards = () => {

    // 좋아요 누른 글들

    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <div className={styles.subWrap}></div>
        </div>
    );
};

export default MyBoards;