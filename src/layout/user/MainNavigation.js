import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import styles from "./MainNavigation.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import UserContext from "../../components/context/user-context";
import { userEditActions } from "../../components/store/user/UserEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { dogEditActions } from "../../components/store/dog/DogEditSlice";
import { NOTICE_URL } from "../../config/user/host-config";

const MainNavigation = () => {
    const navi = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openNotice, setOpenNotice] = useState(false);
    const noticeRef = useRef(null);

    const { changeIsLogin, user, setUser } = useContext(UserContext);
    const userData = useRouteLoaderData("user-data");
    const noticeList = useSelector(state => state.userEdit.userNotice);
    const userDetail = useSelector(state => state.userEdit.userDetail);

    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) {
            changeIsLogin(true);
            setUser(userData);
        }
    }, [userData, changeIsLogin, setUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noticeRef.current && !noticeRef.current.contains(event.target)) {
                setOpenNotice(false);
            }
        };

        if (openNotice) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openNotice]);

    const fetchNotices = async () => {
        try {
            const response = await fetch(`${NOTICE_URL}/user/${userDetail.id}`);
            if (response.ok) {
                const data = await response.json();
                dispatch(userEditActions.saveUserNotice(data));
            }
        } catch (error) {
            console.error('An error occurred while fetching notices:', error);
        }
    };

    useEffect(() => {
        if (userDetail.id) {
            fetchNotices();
        }
    }, [userDetail.id, dispatch]);

    // userDetail의 noticeCount가 변경될 때마다 알림을 가져옵니다.
    useEffect(() => {
        if (userDetail.id) {
            fetchNotices();
        }
    }, [userDetail.noticeCount]);

    const toggleMenuHandler = () => {
        setMenuOpen(prevState => !prevState);
    };

    const logoutHandler = () => {
        localStorage.removeItem("userData");
        localStorage.removeItem("userDetail");
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

    const clearEditMode = async () => {
        dispatch(userEditActions.clearMode());
        dispatch(userEditActions.clearUserEditMode());
        dispatch(dogEditActions.clearEdit());
    };

    const checkNotice = async (noticeId) => {
        try {
            const response = await fetch(`${NOTICE_URL}/click/${noticeId}/${userDetail.id}`, {
                method: 'POST',
            });

            if (response.ok) {
                const updatedNotices = noticeList.map(notice =>
                    notice.id === noticeId ? { ...notice, isClicked: true } : notice
                );
                dispatch(userEditActions.saveUserNotice(updatedNotices));
                dispatch(userEditActions.updateUserDetail({
                    ...userDetail,
                    noticeCount: userDetail.noticeCount - 1
                }));
                console.log('Notice clicked successfully.');
            } else {
                console.error('Failed to click notice.');
            }
        } catch (error) {
            console.error('An error occurred while clicking notice:', error);
        }
    };

    console.log(noticeList);



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
                    {user ? (
                        <>
                            <button className={styles.logout} onClick={logoutHandler}>Logout</button>
                            <BsBell className={styles.icon} onClick={toggleNotice}></BsBell>
                            {Array.isArray(noticeList) && userDetail.noticeCount !== 0 && <span className={styles.count}>{userDetail.noticeCount}</span>}
                            <Link to={"/mypage"} onClick={clearEditMode}><BiUser className={styles.icon} /></Link>
                            <GiHamburgerMenu className={styles.icon} onClick={toggleMenuHandler} />
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
                <div className={styles.noticeWrap} ref={noticeRef}>
                    {Array.isArray(noticeList) && noticeList.length > 0 && noticeList.slice()
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 시간 순서대로 정렬
                        .map((notice) => (
                            <React.Fragment key={notice.id}>
                                <div
                                    className={`${styles.message} ${notice.clicked ? styles.clickedMessage : ''}`}
                                    onClick={!notice.clicked ? () => checkNotice(notice.id) : undefined}
                                >
                                    {notice.message}
                                </div>
                                <div className={styles.time}>
                                    {new Date(notice.createdAt.replace(' ', 'T')).toLocaleString()}
                                </div>
                            </React.Fragment>
                        ))}
                </div>
            )}
        </header>
    );
};

export default MainNavigation;