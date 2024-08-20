import React, { useState, useEffect } from 'react'
import MainNavigation from './MainNavigation'
import {Outlet} from 'react-router-dom'
import Drawer from './Drawer';
import styled from 'styled-components';
import Footer from "./Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out, margin-right 0.3s ease-in-out, height 0.3s ease-in-out;
  transform: ${(props) => 
    props.open 
      ? 'scale(0.75) translateY(calc(-10px + 1vh))'
      : 'scale(1) translateY(0)'};
  transform-origin: left center;
  margin-right: ${(props) => (props.open ? '150px' : '0')};
  height: ${(props) => (props.fullHeight ? '100vh' : 'auto')}; /* height 상태에 따라 변경 */

  @media (max-width: 1000px) {
    margin-right: ${(props) => (props.open ? '100%' : '0')};
    transform: ${(props) => 
      props.open 
        ? 'scale(0.53) translateY(calc(-60px + 1vh))'
        : 'scale(1) translateY(0)'};
  }
`;



const MainContent = styled.main`
  flex: 1;
`;






const RootLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [fullHeight, setFullHeight] = useState(false); // // 카테고리 Drawer 관련

    useEffect(() => {
      // 카테고리 Drawer 관련
      if (drawerOpen) {
        setFullHeight(true); // Drawer가 열리면 100vh 적용
      } else {
        // Drawer가 닫히면 2초 후에 100vh 해제
        const timer = setTimeout(() => {
          setFullHeight(false);
        }, 500);
  
        return () => clearTimeout(timer); // 타이머 클리어
      }
    }, [drawerOpen]);
  
    const toggleDrawerHandler = () => {
      // 카테고리 Drawer 관련
        setDrawerOpen((prevState) => !prevState);
    };

    return (
        <>
        <Container open={drawerOpen} fullHeight={fullHeight}>
            <MainNavigation drawerOpen={drawerOpen} onToggleDrawer={toggleDrawerHandler} />
            <MainContent>
            <Outlet />
            </MainContent>
        </Container>
        <Drawer open={drawerOpen} onClose={toggleDrawerHandler} /> {/* Drawer를 헤더 바깥에 렌더링 */}
        </>
    )
}

export default RootLayout