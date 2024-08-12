import React from 'react';
import styles from './HotelBookStatus.module.scss'

const HotelBookStatus = () => {
    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <div className={styles.total}>예약 건수</div>
                    <ul className={styles.ul}>
                        <li className={styles.menu}>일 별</li>
                        <li className={styles.menu}>주간 별</li>
                        <li className={styles.menu}>월 별</li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default HotelBookStatus;
