import React, { useState, useEffect } from 'react';
import MainNavigation from './MainNavigation';
import { Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Footer from "./Footer";
import {useSelector} from "react-redux";

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

    const userDetail = useSelector(state => state.userEdit.userDetail);
    console.log(userDetail.autoLogin)

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!userDetail.autoLogin) {
                localStorage.removeItem('userData');
                localStorage.removeItem('userDetail');
            }
        };

        // 이벤트 리스너 등록


        window.addEventListener('beforeunload', handleBeforeUnload);

        // 컴포넌트가 언마운트되거나 userDetail.autoLogin 값이 변경될 때 이전 리스너 제거
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [userDetail.autoLogin]); // userDetail.autoLogin이 변경될 때마다 useEffect 재실행


    const [drawerOpen, setDrawerOpen] = useState(false);
    const [fullHeight, setFullHeight] = useState(false); // 관리되는 상태

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
