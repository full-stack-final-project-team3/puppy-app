import React from 'react';
import styles from './MainNavigation.module.scss';
import {NavLink, Form, useRouteLoaderData} from 'react-router-dom';

const MainNavigation = () => {
    const userData = useRouteLoaderData('user-data');

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        { !userData ? <NavLink to='/login'>Login</NavLink> : <NavLink to='/mypage'>MyPage</NavLink>}
                    </li>
                    <li>
                        <Form method='post' action='/logout'>
                            <button type='submit' className={styles.logoutButton}>Logout</button>
                        </Form>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;