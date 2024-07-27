import React from 'react';
import {BiHome, BiLeftArrow } from "react-icons/bi";
import styles from "./MyPageHeader.module.scss";
import {useNavigate} from "react-router-dom";

const MyPageHeader = () => {

    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/')
    }

    return (
        <header className={styles.headerWrap}>
            <BiLeftArrow className={styles.icon}/>
            <h3>MY PAGE</h3>
            <BiHome className={styles.icon} onClick={goToHome}/>
        </header>
    );
};

export default MyPageHeader;