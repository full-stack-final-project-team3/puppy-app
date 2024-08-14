import React from 'react';
import styles from './HotelBookStatus.module.scss'
import {ADMIN_URL} from "../../../config/user/host-config";
import SeasonalityChart from "../../../pages/hotel/SeasonalityChart";

const HotelBookStatus = () => {

    // const fetchHotelBookStatus = async () => {
    //     const response = await fetch(`${ADMIN_URL}/hotel/booked/count`);
    //     const fetchData = await response.json();
    //     console.log(fetchData)
    // }
    // fetchHotelBookStatus()


    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <div className={styles.total}>예약 건수</div>
                </nav>
                    <SeasonalityChart/>
            </div>
        </>
    );
};

export default HotelBookStatus;
