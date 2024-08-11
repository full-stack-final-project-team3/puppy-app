import React from 'react';
import styles from './HotelBookStatus.module.scss'

const HotelBookStatus = () => {
    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <ul className={styles.ul}>
                        <li className={styles.menu}>전체 예약 건수</li>
                        <li className={styles.menu}>호텔 별 예약 수</li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default HotelBookStatus;