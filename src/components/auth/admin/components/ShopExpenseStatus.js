import React, {useEffect, useState} from 'react';
import styles from "./TotalExpenseStatus.module.scss";
import ShowDayShopTotalPoint from "./shop-total-point/ShowDayShopTotalPoint";
import ShowMonthShopTotalPoint from "./shop-total-point/ShowMonthShopTotalPoint";
import ShowWeekShopTotalPoint from "./shop-total-point/ShowWeekShopTotalPoint";
import {ADMIN_URL} from "../../../../config/user/host-config";
import moment from "moment/moment";

const TotalExpenseStatus = () => {

    const [totalPoint, setTotalPoint] = useState(0);

    const [showDay, setShowDay] = useState(true);
    const [showWeek, setShowWeek] = useState(false);
    const [showMonth, setShowMonth] = useState(false);

    const dayHandler = () => {
        setShowDay(true);
        setShowWeek(false);
        setShowMonth(false);
    };

    const weekHandler = () => {
        setShowDay(false);
        setShowWeek(true);
        setShowMonth(false);
    };

    const monthHandler = () => {
        setShowDay(false);
        setShowWeek(false);
        setShowMonth(true);
    };

    useEffect(() => {
        const fetchMonthShopTotalPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/orders/monthly`);
                const result = await response.json();

                const sum = result.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                }, 0);
                const formatPrice = (price) => {
                    return new Intl.NumberFormat('ko-KR').format(price);
                };

                setTotalPoint(formatPrice(sum));

            } catch (error) {
                console.error("Failed to fetch monthly shop point data:", error);
            }
        };

        fetchMonthShopTotalPoint();
    }, []);


    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <ul className={styles.ul}>
                        <li className={`${styles.menu} ${showDay && styles.active}`} onClick={dayHandler}>일별</li>
                        <li className={`${styles.menu} ${showWeek && styles.active}`} onClick={weekHandler}>주별</li>
                        <li className={`${styles.menu} ${showMonth && styles.active}`} onClick={monthHandler}>월별</li>
                    </ul>
                </nav>
            </div>
            <div className={styles.total}>총 누적 지출<br/><span className={styles.number}>{totalPoint}p</span></div>
            <div className={styles.chartContainer}>
                {showDay && <ShowDayShopTotalPoint/>}
                {showWeek && <ShowWeekShopTotalPoint/>}
                {showMonth && <ShowMonthShopTotalPoint/>}
            </div>
        </>
    );
};

export default TotalExpenseStatus;