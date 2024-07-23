import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MainNavigation.module.scss';
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { BiUser } from "react-icons/bi";

const MainNavigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleMenuHandler = () => {
        setMenuOpen(prevState => !prevState);
    };

    const logoutHandler = () => {
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        window.location.reload(); // 로그아웃 후 페이지 새로고침
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.left}></div>
                <div className={styles.center}>
                    <NavLink to='/'>
                        <img src="/header-logo.png" alt="Header Logo" />
                    </NavLink>
                </div>
                <div className={styles.right}>
                    {isLoggedIn ? (
                        <>
                            <button className={styles.logout} onClick={logoutHandler}>Logout</button>
                            <BsBell className={styles.icon} />
                            <BiUser className={styles.icon} /> 
                            <GiHamburgerMenu className={styles.icon} onClick={toggleMenuHandler} />
                        </>
                    ) : (
                        <>
                            <NavLink className={styles.login} to='/login'>Login</NavLink>
                            <BiUser className={styles.icon} /> {/* 여기에 추가 */}
                            <GiHamburgerMenu className={styles.icon} onClick={toggleMenuHandler} />
                        </>
                    )}
                </div>
            </nav>
            {menuOpen && (
                <div className={styles.dropdownMenu}>
                    <ul>
                        <li><NavLink to='/hotel'>hotel</NavLink></li>
                        <li><NavLink to='/category2'>Category 2</NavLink></li>
                        <li><NavLink to='/category3'>Category 3</NavLink></li>
                    </ul>
                </div>
            )}
        </header>
    );
}

export default MainNavigation;
