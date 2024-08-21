import React, { useState } from 'react';
import styles from './UserCount.module.scss';
import ShowUserDay from "./components/ShowUserDay";
import ShowUserMonth from "./components/ShowUserMonth";
import ShowUserWeek from "./components/ShowUserWeek";

const UserCount = () => {
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
                        <li className={`${styles.menu} ${showDay && styles.active}`} onClick={dayHandler}>일별</li>
                        <li className={`${styles.menu} ${showWeek && styles.active}`}onClick={weekHandler}>주별</li>
                        <li className={`${styles.menu} ${showMonth && styles.active}`} onClick={monthHandler}>월별</li>
                    </ul>
                </nav>
            </div>
            <div className={styles.chartContainer}>
                {showDay && <ShowUserDay />}
                {showWeek && <ShowUserWeek />}
                {showMonth && <ShowUserMonth />}
            </div>
        </>
    );
};

export default UserCount;