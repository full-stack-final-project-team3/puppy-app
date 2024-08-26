import React, { useState, useEffect, useContext } from 'react';
import MainNavigation from './MainNavigation';
import { Outlet, useNavigate } from 'react-router-dom';
import Drawer from './Drawer';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Footer from "./Footer";
import { useCookies } from 'react-cookie';
import { AUTH_URL } from '../../config/user/host-config';
import { useDispatch } from "react-redux";
import { userEditActions } from "../../components/store/user/UserEditSlice";
import UserContext from "../../components/context/user-context";

// Container 컴포넌트가 fullHeight prop을 DOM 요소에 전달하지 않도록 설정
const Container = styled(motion.div).withConfig({
    shouldForwardProp: (prop) => !['fullHeight'].includes(prop)
})`
    display: flex;
    flex-direction: column;
    transform-origin: left center;
    height: ${(props) => (props.fullHeight ? '100vh' : 'auto')};

    @media (max-width: 1000px) {
        margin-right: ${(props) => (props.open ? '100%' : '0')};
    }
`;

const MainContent = styled.main`
    flex: 1;
`;

const RootLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [fullHeight, setFullHeight] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { changeIsLogin, setUser } = useContext(UserContext);

    // useEffect(() => {
    //     const authToken = cookies.authToken;
    //
    //     if (authToken) {
    //         const fetchData = async () => {
    //             try {
    //                 const firstResponse = await fetch(`${AUTH_URL}/auto-login`, {
    //                     method: "POST",
    //                     headers: {
    //                         Authorization: `Bearer ${authToken}`,
    //                         "Content-Type": "application/json",
    //                     },
    //                 });
    //
    //                 if (firstResponse.ok) {
    //                     const userData = await firstResponse.json();
    //
    //                     // 사용자 세부 정보를 상태에 저장하고 로그인 상태 업데이트
    //                     dispatch(userEditActions.updateUserDetail(userData));
    //                     setUser(userData);
    //                     changeIsLogin(true);
    //                 } else {
    //                     // 토큰이 유효하지 않다면 쿠키를 제거하고 로그인 페이지로 이동
    //                     removeCookie('authToken', { path: '/' });
    //                     // navigate("/login");
    //                 }
    //             } catch (error) {
    //                 console.error("자동 로그인 중 오류 발생:", error);
    //                 removeCookie('authToken', { path: '/' });
    //                 // navigate("/login");
    //             }
    //         };
    //
    //         fetchData();
    //     } else {
    //         // 쿠키가 없으면 로그인 페이지로 이동
    //         // navigate("/login");
    //     }
    // }, [cookies.authToken, dispatch, navigate, removeCookie, changeIsLogin, setUser]);

    useEffect(() => {
        if (drawerOpen) {
            setFullHeight(true); // Drawer가 열리면 100vh 적용
        } else {
            const timer = setTimeout(() => {
                setFullHeight(false); // Drawer가 닫히면 2초 후에 100vh 해제
            }, 1000);

            return () => clearTimeout(timer); // 타이머 클리어
        }
    }, [drawerOpen]);

    const toggleDrawerHandler = () => {
        setDrawerOpen((prevState) => !prevState);
    };

    return (
        <>
            <Container
                open={drawerOpen}
                fullHeight={fullHeight}
                initial={{ scale: 1, translateY: 0 }}
                animate={{
                    scale: drawerOpen ? 0.75 : 1,
                    translateY: drawerOpen ? 'calc(-10px + 1vh)' : '0',
                }}
                transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: drawerOpen ? 25 : 35,
                    mass: 1,
                    restDelta: 0.001,
                }}
            >
                <MainNavigation drawerOpen={drawerOpen} onToggleDrawer={toggleDrawerHandler} />
                <MainContent>
                    <Outlet />
                </MainContent>
            </Container>
            <Drawer open={drawerOpen} onClose={toggleDrawerHandler} />
        </>
    );
};

export default RootLayout;
