import React from 'react';
import styles from './MainNavigation.module.scss';
import { NavLink } from 'react-router-dom';

const MainNavigation = () => {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <NavLink to='/login'>Login</NavLink>
                    </li>
                    <li>
                        <NavLink to='/logout' method='POST'>Logout</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;