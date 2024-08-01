import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import styles from "./MainNavigation.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import UserContext from "../../components/context/user-context";
import { userEditActions } from "../../components/store/user/UserEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { dogEditActions } from "../../components/store/dog/DogEditSlice";
import { userActions } from "../../components/store/user/UserSlice";

const MainNavigation = () => {
    let navi = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openNotice, setOpenNotice] = useState(false);

    const existNotice = useSelector(state => state.user.existNotice);
    const noticeCount = useSelector(state => state.user.noticeCount);
    const messages = useSelector(state => state.user.noticeMessage);
    const clickedMessages = useSelector(state => state.user.clickedMessages);

    const { changeIsLogin, user, setUser } = useContext(UserContext);
    const userData = useRouteLoaderData("user-data");

    const dispatch = useDispatch();
    const clearEditMode = async () => {
        dispatch(userEditActions.clearMode());
        dispatch(userEditActions.clearUserEditMode());
        dispatch(dogEditActions.clearEdit());
    };

    useEffect(() => {
        if (userData) {
            changeIsLogin(true);
            setUser(userData);
        }
    }, [userData, changeIsLogin, setUser]);

    const toggleMenuHandler = () => {
        setMenuOpen(prevState => !prevState);
    };

    const logoutHandler = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('userDetail');

        const currentUrl = window.location.href;
        if (currentUrl !== 'http://localhost:3000/') {
            window.location.href = 'http://localhost:3000/';
        } else {
            window.location.reload();
        }
    };

    const loginHandler = () => {
        navi("/login");
    };

    const toggleNotice = () => {
        setOpenNotice(prevState => !prevState);
    };

    const clearNotice = (index) => {
        dispatch(userActions.clearExistNotice(index));
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.left}></div>
                <div className={styles.center}>
                    <NavLink to='/'>
                        <img className={styles.img} src="/header-logo.png" alt="Header Logo" />
                    </NavLink>
                </div>
                <div className={styles.right}>
                    { user ? (
                        <>
                            <button className={styles.logout} onClick={logoutHandler}>Logout</button>
                            <BsBell className={styles.icon} onClick={toggleNotice}></BsBell>
                            {noticeCount !== 0 ? <span className={styles.count}>{noticeCount}</span>: undefined}
                            <Link to={"/mypage"} onClick={clearEditMode}><BiUser className={styles.icon}/></Link>
                            <GiHamburgerMenu className={styles.icon} onClick={toggleMenuHandler}/>
                        </>
                    ) : (
                        <>
                            <NavLink className={styles.login} to='/login'>Login</NavLink>
                            <BiUser onClick={loginHandler} className={styles.icon} />
                            <GiHamburgerMenu className={styles.icon} onClick={toggleMenuHandler} />
                        </>
                    )}
                </div>
            </nav>
            {menuOpen && (
                <div className={styles.dropdownMenu}>
                    <ul>
                        <li><NavLink to='/hotel'>Hotel</NavLink></li>
                        <li><NavLink to='/treats'>Shop</NavLink></li>
                        <li><NavLink to='/boards'>Community</NavLink></li>
                    </ul>
                </div>
            )}
            {openNotice && (
                <div className={styles.noticeWrap}>
                    {Array.isArray(messages) && messages.slice().reverse().map((message, index) => (
                        <div
                            key={index}
                            onClick={() => clearNotice(index)}
                            className={`${styles.message} ${clickedMessages[index] ? styles.clicked : ''}`}
                        >
                            {message.message}
                            <div className={styles.time}>{message.time}</div>
                        </div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default MainNavigation;