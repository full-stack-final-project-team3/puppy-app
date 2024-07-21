import React from 'react';
import styles from './MainNavigation.module.scss';
import { NavLink, Form, useRouteLoaderData } from 'react-router-dom';

const MainNavigation = () => {
    const userData = useRouteLoaderData('user-data');

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul>
                    {!userData ? (
                        <li>
                            <NavLink to='/login'>Login</NavLink>
                        </li>
                    ) : (
                        <>
                            <li>
                                <NavLink to='/mypage'>MyPage</NavLink>
                            </li>
                            <li>
                                <NavLink to='/hotel'>Hotel</NavLink>
                            </li>
                            <li>
                                <Form method='post' action='/logout'>
                                    <button type='submit' className={styles.logoutButton}>Logout</button>
                                </Form>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;
