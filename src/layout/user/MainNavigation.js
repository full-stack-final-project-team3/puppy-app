import React, { useState, useContext, useEffect } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import styles from "./MainNavigation.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import UserContext from "../../components/context/user-context";
import {userEditActions} from "../../components/store/user/UserEditSlice";
import {useDispatch} from "react-redux";
import {dogEditActions} from "../../components/store/dog/DogEditSlice";

const MainNavigation = () => {
  let navi = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { changeIsLogin, user, setUser } = useContext(UserContext);
  const userData = useRouteLoaderData("user-data");

  // 유저가 회원정보 수정 중 마이페이지를 누르면 화면이 변환되는 함수
  const dispatch = useDispatch();
  const clearEditMode = async () => {
    dispatch(userEditActions.clearMode());
    dispatch(userEditActions.clearUserEditMode());
  };

    // 유저가 회원정보 수정 중 마이페이지를 누르면 화면이 변환되는 함수
    const dispatch = useDispatch();
    const clearEditMode = async () => {
        dispatch(userEditActions.clearMode());
        dispatch(userEditActions.clearUserEditMode());
        dispatch(dogEditActions.clearEdit())
    }
  }, [userData, changeIsLogin, setUser]);

  const toggleMenuHandler = () => {
    setMenuOpen((prevState) => !prevState);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userDetail");

    const logoutHandler = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('userDetail');

    // 현재 URL이 루트 경로가 아닌 경우 루트 경로로 리다이렉트
    if (currentUrl !== "http://localhost:3000/") {
      window.location.href = "http://localhost:3000/";
    } else {
      // 현재 페이지를 새로고침
      window.location.reload();
    }
  };

  const loginHandler = () => {
    navi("/login");
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.left}></div>
        <div className={styles.center}>
          <NavLink to="/">
            <img
              className={styles.img}
              src="/header-logo.png"
              alt="Header Logo"
            />
          </NavLink>
        </div>
        <div className={styles.right}>
          {user ? (
            <>
              <button className={styles.logout} onClick={logoutHandler}>
                Logout
              </button>
              <BsBell className={styles.icon} />
              <Link to={"/mypage"} onClick={clearEditMode}>
                <BiUser className={styles.icon} />
              </Link>
              <GiHamburgerMenu
                className={styles.icon}
                onClick={toggleMenuHandler}
              />
            </>
          ) : (
            <>
              <NavLink className={styles.login} to="/login">
                Login
              </NavLink>
              <BiUser onClick={loginHandler} className={styles.icon} />
              <GiHamburgerMenu
                className={styles.icon}
                onClick={toggleMenuHandler}
              />
            </>
          )}
        </div>
      </nav>
      {menuOpen && (
        <div className={styles.dropdownMenu}>
          <ul>
            <li>
              <NavLink to="/hotel">Hotel</NavLink>
            </li>
            <li>
              <NavLink to="/treats">Shop</NavLink>
            </li>
            <li>
              <NavLink to="/boards">Community</NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default MainNavigation;
