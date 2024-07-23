import React from 'react';
import styles from './MainNavigation.module.scss';
import { NavLink, useRouteLoaderData } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import {BsBell} from "react-icons/bs";
import {BiUser} from "react-icons/bi";

const MainNavigation = () => {
    const userData = useRouteLoaderData('user-data');

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.left}></div>
                <div className={styles.center}>
                    <NavLink to='/login'>
                        <img src="/header-logo.png" alt="Header Logo" />
                    </NavLink>
                </div>
                <div className={styles.right}>
                    { !userData ? (
                        <>
                            <NavLink className={styles.login} to='/login'>Login</NavLink>
                            <GiHamburgerMenu className={styles.icon} />
                        </>
                    ) : (
                        <>
                            <BsBell className={styles.icon}/>
                            <BiUser className={styles.icon}/>
                            <GiHamburgerMenu className={styles.icon}/>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default MainNavigation;