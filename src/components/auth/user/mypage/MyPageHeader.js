import React from 'react';
import {BiHome, BiLeftArrow } from "react-icons/bi";
import styles from "./MyPageHeader.module.scss";

const MyPageHeader = () => {
    return (
        <header className={styles.headerWrap}>
            <BiLeftArrow className={styles.icon}/>
            <h3>MY PAGE</h3>
            <BiHome className={styles.icon}/>
        </header>
    );
};

export default MyPageHeader;