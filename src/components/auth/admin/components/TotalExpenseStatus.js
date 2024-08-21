import React, {useState} from 'react';
import styles from "./TotalExpenseStatus.module.scss";
import ShowDayTotalPoint from "./total-point/ShowDayTotalPoint";
import ShowMonthTotalPoint from "./total-point/ShowMonthTotalPoint";
import ShowWeekTotalPoint from "./total-point/ShowWeekTotalPoint";

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
            전체
            <div className={styles.chartContainer}>
                {showDay && <ShowDayTotalPoint/>}
                {showWeek && <ShowWeekTotalPoint/>}
                {showMonth && <ShowMonthTotalPoint/>}
            </div>
        </>
    );
};

export default TotalExpenseStatus;