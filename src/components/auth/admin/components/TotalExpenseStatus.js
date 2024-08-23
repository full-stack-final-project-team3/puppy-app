import React, {useEffect, useState} from 'react';
import styles from "./TotalExpenseStatus.module.scss";
import ShowDayTotalPoint from "./total-point/ShowDayTotalPoint";
import ShowMonthTotalPoint from "./total-point/ShowMonthTotalPoint";
import ShowWeekTotalPoint from "./total-point/ShowWeekTotalPoint";
import {ADMIN_URL} from "../../../../config/user/host-config";
import moment from "moment/moment";

const TotalExpenseStatus = () => {

    const [showDay, setShowDay] = useState(true);
    const [showWeek, setShowWeek] = useState(false);
    const [showMonth, setShowMonth] = useState(false);
    const [totalPoint, setTotalPoint] = useState(0);

    useEffect(() => {
        const fetchMonthTotalPoint = async () => {
            try {
                const response = await fetch(`${ADMIN_URL}/expenses/monthly`);
                const result = await response.json();

                const sum = result.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                }, 0);

                const formatPrice = (price) => {
                    return new Intl.NumberFormat('ko-KR').format(price);
                };

                setTotalPoint(formatPrice(sum));
            } catch (error) {
                console.error("Failed to fetch monthly total points:", error);
            }
        };

        fetchMonthTotalPoint();
    }, []);



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


    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <ul className={styles.ul}>
                        <li className={`${styles.menu} ${showDay && styles.active}`}  onClick={dayHandler}>일별</li>
                        <li className={`${styles.menu} ${showWeek && styles.active}`}  onClick={weekHandler}>주별</li>
                        <li className={`${styles.menu} ${showMonth && styles.active}`}  onClick={monthHandler}>월별</li>
                    </ul>
                </nav>
            </div>
            <div className={styles.total}>총 누적 지출<br/><span className={styles.number}>{totalPoint}p</span></div>
            <div className={styles.chartContainer}>
                {showDay && <ShowDayTotalPoint/>}
                {showWeek && <ShowWeekTotalPoint/>}
                {showMonth && <ShowMonthTotalPoint/>}
            </div>
        </>
    );
};

export default TotalExpenseStatus;