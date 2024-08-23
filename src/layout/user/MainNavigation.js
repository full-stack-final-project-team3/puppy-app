import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import styles from "./MainNavigation.module.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBell } from "react-icons/bs";
import { BiBasket, BiUser } from "react-icons/bi";
import UserContext from "../../components/context/user-context";
import { userEditActions } from "../../components/store/user/UserEditSlice";
import { useDispatch, useSelector } from "react-redux";
import { dogEditActions } from "../../components/store/dog/DogEditSlice";
import { NOTICE_URL } from "../../config/user/host-config";
import NoticeList from "../../components/auth/user/NoticeList";

const MainNavigation = ({ drawerOpen, onToggleDrawer }) => {
  const navi = useNavigate();
  const [openNotice, setOpenNotice] = useState(false);
  const noticeRef = useRef(null);

  const { changeIsLogin, user, setUser } = useContext(UserContext);
  const userData = useRouteLoaderData("user-data");
  const noticeList = useSelector((state) => state.userEdit.userNotice);
  const userDetail = useSelector((state) => state.userEdit.userDetail);

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
      console.error("An error occurred while fetching notices:", error);
    }
  };

  useEffect(() => {
    if (userDetail.id) {
      fetchNotices();
    }
  }, [userDetail.id, dispatch]);

  useEffect(() => {
    if (userDetail.id) {
      fetchNotices();
    }
  }, [userDetail.noticeCount]);

  const logoutHandler = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userDetail");
    const currentUrl = window.location.href;
    if (currentUrl !== "http://localhost:3000/") {
      window.location.href = "http://localhost:3000/";
    } else {
      window.location.reload();
    }
  };

  const loginHandler = () => {
    navi("/login");
  };

  const toggleNotice = () => {
    setOpenNotice((prevState) => !prevState);
  };

  const clearEditMode = async () => {
    dispatch(userEditActions.clearMode());
    dispatch(userEditActions.clearUserEditMode());
    dispatch(dogEditActions.clearEdit());
  };

  const checkNotice = async (noticeId) => {
    try {
      const response = await fetch(
          `${NOTICE_URL}/click/${noticeId}/${userDetail.id}`,
          {
            method: "POST",
          }
      );

      if (response.ok) {
        const updatedNotices = noticeList.map((notice) =>
            notice.id === noticeId ? { ...notice, isClicked: true } : notice
        );
        dispatch(userEditActions.saveUserNotice(updatedNotices));
        dispatch(
            userEditActions.updateUserDetail({
              ...userDetail,
              noticeCount: userDetail.noticeCount - 1,
            })
        );

      } else {
        console.error("Failed to click notice.");
      }
    } catch (error) {
      console.error("An error occurred while clicking notice:", error);
    }
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
            {userDetail ? (
                <>
                  <div className={styles.welcome}>
                    Welcome {userDetail.nickname}
                  </div>
                  <button className={styles.logout} onClick={logoutHandler}>
                    Logout
                  </button>
                  <Link to={"/cart"}>
                    <BiBasket className={`${styles.icon} ${styles.basket}`} />
                  </Link>
                  <BsBell className={styles.bell} onClick={toggleNotice}></BsBell>
                  {Array.isArray(noticeList) && userDetail.noticeCount > 0 && (
                      <span className={styles.count}>{userDetail.noticeCount}</span>
                  )}
                  <Link to={"/mypage"} onClick={clearEditMode}>
                    <img className={styles.profile} src={userDetail.profileUrl} alt="Profile" />
                  </Link>
                  <GiHamburgerMenu
                      className={styles.icon}
                      onClick={onToggleDrawer} // 기존 toggleMenuHandler에서 toggleDrawerHandler로 변경
                  />
                </>
            ) : (
                <>
                  <NavLink className={styles.login} to="/login">
                    Login
                  </NavLink>
                  <BiUser onClick={loginHandler} className={`${styles.icon} ${styles.user}`} />
                  <GiHamburgerMenu
                      className={`${styles.icon} ${styles.hamburger}`}
                      onClick={onToggleDrawer} // 기존 toggleMenuHandler에서 toggleDrawerHandler로 변경
                  />
                </>
            )}
          </div>
        </nav>
        <NoticeList
            openNotice={openNotice}
            noticeList={noticeList}
            noticeRef={noticeRef}
            checkNotice={checkNotice}
            onClose={() => setOpenNotice(false)}
        />
      </header>
  );
};

export default MainNavigation;