import React from 'react';
import styles from './HotelBookStatus.module.scss'
import {ADMIN_URL} from "../../../config/user/host-config";

const HotelBookStatus = () => {

    const fetchHotelBookStatus = async () => {
        const response = await fetch(`${ADMIN_URL}/hotel/booked/count`);
        const fetchData = await response.json();
        console.log(fetchData)
    }
    fetchHotelBookStatus()


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
