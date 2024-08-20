import React, { useState, useEffect } from 'react'
import MainNavigation from './MainNavigation'
import {Outlet} from 'react-router-dom'
import Drawer from './Drawer';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Footer from "./Footer";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  transform-origin: left center;
  // margin-right: ${(props) => (props.open ? '150px' : '0')};
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
    const [fullHeight, setFullHeight] = useState(false); // // 카테고리 Drawer 관련

    useEffect(() => {
      // 카테고리 Drawer 관련
      if (drawerOpen) {
        setFullHeight(true); // Drawer가 열리면 100vh 적용
      } else {
        // Drawer가 닫히면 2초 후에 100vh 해제
        const timer = setTimeout(() => {
          setFullHeight(false);
        }, 1000);
  
        return () => clearTimeout(timer); // 타이머 클리어
      }
    }, [drawerOpen]);
  
    const toggleDrawerHandler = () => {
      // 카테고리 Drawer 관련
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
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: drawerOpen ? 25 : 35,  // drawerOpen에 따라 damping 값 조절
          mass: 1,       // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
      >
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