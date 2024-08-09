import React, {useState} from 'react';
import HotelExpenseStatus from "./components/HotelExpenseStatus";
import ShopExpenseStatus from "./components/ShopExpenseStatus";
import TotalExpenseStatus from "./components/TotalExpenseStatus";
import styles from "./UserCount.module.scss";

const UserPointStatus = () => {

    const [showTotal, setShowTotal] = useState(true);
    const [showHotel, setShowHotel] = useState(false);
    const [showShop, setShowShop] = useState(false);

    const totalHandler = () => {
        setShowTotal(true)
        setShowHotel(false)
        setShowShop(false)
    }

    const hotelHandler = () => {
        setShowTotal(false)
        setShowHotel(true)
        setShowShop(false)
    }
    const shopHandler = () => {
        setShowTotal(false)
        setShowHotel(false)
        setShowShop(true)
    }

    return (
        <>
            <div>
                <nav className={styles.nav}>
                    <ul className={styles.ul}>
                        <li className={styles.menu} onClick={totalHandler}>전체 지출</li>
                        <li className={styles.menu} onClick={hotelHandler}>호텔</li>
                        <li className={styles.menu} onClick={shopHandler}>쇼핑몰</li>
                    </ul>
                </nav>
            </div>
            <div>
                {showTotal && <TotalExpenseStatus/>}
                {showHotel && <HotelExpenseStatus/>}
                {showShop && <ShopExpenseStatus/>}
            </div>
        </>
    );
};

export default UserPointStatus;