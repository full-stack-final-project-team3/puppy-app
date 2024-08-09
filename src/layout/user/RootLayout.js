import React, { useState } from 'react'
import MainNavigation from './MainNavigation'
import {Outlet} from 'react-router-dom'
import Drawer from './Drawer';
import styled from 'styled-components';
import Footer from "./Footer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out, margin-right 0.3s ease-in-out;
  transform: ${(props) => 
    props.open 
      ? 'scale(0.75) translateY(calc(-70px + 1vh))' // 기본값 -70px에 1vh를 더해서 계산
      : 'scale(1) translateY(0)'};
  transform-origin: left center;
  margin-right: ${(props) => (props.open ? '150px' : '0')};

  @media (max-width: 1000px) {
    margin-right: ${(props) => (props.open ? '100%' : '0')};
    transform: ${(props) => 
      props.open 
        ? 'scale(0.53) translateY(calc(-70px + 1vh))' // 기본값 -70px에 1vh를 더해서 계산
        : 'scale(1) translateY(0)'};
  }
`;

const MainContent = styled.main`
  flex: 1;
`;






const RootLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawerHandler = () => {
        setDrawerOpen((prevState) => !prevState);
    };

    return (
        <>
        <Container open={drawerOpen}>
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