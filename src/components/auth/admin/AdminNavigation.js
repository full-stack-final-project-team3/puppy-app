import React from 'react';
import styles from './AdminNavigation.module.scss'

const AdminNavigation = () => {
    return (
        <div className={styles.navigation}>
            <p>사용자 수 관리</p>
            <p>신규 가입자</p>
            <p>호텔 예약 현황</p>
            <p>쇼핑몰 이용 현황</p>
            <p>유저 포인트 지출 현황</p>
            <p>신고 및 민원</p>
        </div>
    );
};

export default AdminNavigation;