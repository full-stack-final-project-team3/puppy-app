import React, {useState} from 'react';
import styles from "./TotalExpenseStatus.module.scss";
import ShowDayHotelPoint from "./hotel-total-point/ShowDayHotelPoint";
import ShowWeekHotelPoint from "./hotel-total-point/ShowWeekHotelPoint";
import ShowMonthHotelPoint from "./hotel-total-point/ShowMonthHotelPoint";

const TotalExpenseStatus = () => {

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


    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <ul className={styles.ul}>
                        <li className={styles.menu} onClick={dayHandler}>일별</li>
                        <li className={styles.menu} onClick={weekHandler}>주별</li>
                        <li className={styles.menu} onClick={monthHandler}>월별</li>
                    </ul>
                </nav>
            </div>
            <div className={styles.chartContainer}>
                {showDay && <ShowDayHotelPoint/>}
                {showWeek && <ShowWeekHotelPoint/>}
                {showMonth && <ShowMonthHotelPoint/>}
            </div>
            호텔
        </>
    );
};

export default TotalExpenseStatus;