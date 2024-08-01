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
import { userActions } from "../../components/store/user/UserSlice";

const MainNavigation = () => {
    const navi = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openNotice, setOpenNotice] = useState(false);
    const noticeRef = useRef(null);


    const { changeIsLogin, user, setUser } = useContext(UserContext);
    const userData = useRouteLoaderData("user-data");

    const dispatch = useDispatch();

    // 사용자 데이터가 있을 경우 로그인 상태로 설정하고 사용자 데이터를 업데이트
    useEffect(() => {
        if (userData) {
            changeIsLogin(true);
            setUser(userData);
        }
    }, [userData, changeIsLogin, setUser]);

    // 외부 클릭을 감지하여 알림 창을 닫기 위한 이벤트 리스너 설정
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

    // 메뉴 토글 핸들러
    const toggleMenuHandler = () => {
        setMenuOpen(prevState => !prevState);
    };

    // 로그아웃 핸들러
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

    // 로그인 핸들러
    const loginHandler = () => {
        navi("/login");
    };

    // 알림 창 토글 핸들러
    const toggleNotice = () => {
        setOpenNotice(prevState => !prevState);
    };



    // 회원 정보 수정 중 마이페이지를 누르면 화면이 변환되는 함수
    const clearEditMode = async () => {
        dispatch(userEditActions.clearMode());
        dispatch(userEditActions.clearUserEditMode());
        dispatch(dogEditActions.clearEdit());
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
                    {user ? (
                        <>
                            <button className={styles.logout} onClick={logoutHandler}>Logout</button>
                            <BsBell className={styles.icon} onClick={toggleNotice}></BsBell>
                            {/*{noticeCount !== 0 ? <span className={styles.count}>{noticeCount}</span> : undefined}*/}
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
                <div className={styles.noticeWrap}>

                </div>
            )}
        </header>
    );
};

export default MainNavigation;