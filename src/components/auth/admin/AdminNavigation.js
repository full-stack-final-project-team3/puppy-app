import React from 'react';
import { useDispatch } from 'react-redux';
import { adminActions } from "../../store/user/AdminSlice"; // 적절한 경로로 수정하세요
import styles from './AdminNavigation.module.scss';

const AdminNavigation = ({ exit }) => {
    const dispatch = useDispatch();

    const handleNavigationClick = (componentName) => {
        dispatch(adminActions.setVisibleComponent(componentName));
    };

    const exitHandler = () => {
        exit(false)
    }

    return (
        <div className={styles.navigation}>
            <p className={styles.menu} onClick={() => handleNavigationClick('UserCount')}>사용자 수 관리</p>
            <p className={styles.menu} onClick={() => handleNavigationClick('NewUsers')}>신규 가입자</p>
            <p className={styles.menu} onClick={() => handleNavigationClick('HotelBookStatus')}>호텔 예약 현황</p>
            <p className={styles.menu} onClick={() => handleNavigationClick('ShopStatus')}>쇼핑몰 이용 현황</p>
            <p className={styles.menu} onClick={() => handleNavigationClick('UserPointStatus')}>유저 포인트 지출 현황</p>
            <p className={styles.menu} onClick={() => handleNavigationClick('ReportStatus')}>신고 및 민원</p>
            <p className={styles.menu} onClick={exitHandler}>마이페이지 돌아가기</p>
        </div>
    );
};

export default AdminNavigation;