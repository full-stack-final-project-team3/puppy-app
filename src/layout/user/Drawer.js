// src/components/Drawer.js
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";

const DrawerContainer = styled.div`
  font-family: 'NotoSansKR';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: 600px;
  height: 100%;
  background-color: #14332C;
  transform: translateX(${(props) => (props.open ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 1400;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    transform: translateX(${(props) => (props.open ? '0' : '100%')});
  }
`;

const NavItem = styled.a`
  position: relative;
  left: 35%;
  margin-top: 20px;
  color: #fff;
  text-decoration: none;
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 20px;
  cursor: pointer;

  &:hover {
    color: #D88254;
  }

  &.special-spacing {
    margin-top: 100px; /* Home과 MyPage 사이의 간격을 40px로 증가 */
  }

  &.special-spacing-home {
    margin-top: 100px;
    font-size: 45px;
  }
`;


const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px; /* Spacing between the icons */
  width: 100%; /* Ensure the icons are centered */
  z-index: 1800; /* Ensure this is above the DrawerContainer's z-index */

  &.navIcons {
    position: relative;
    right: 5%;
    margin-top: 50px;
  }
  a {
    color: #fff;
    font-size: 40px;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: #D88254;
    }
  }
`;


const TopDrawerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: #14332C;
  transform: translateY(${(props) => (props.open ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    height: 50%;
  }
`;

const BottomDrawerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background-color: #14332C;
  transform: translateY(${(props) => (props.open ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 1200;

  @media (max-width: 768px) {
    height: 50%;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 42.5%;
  right: 42.5%; /* 50px 왼쪽으로 이동 */
  width: 100px;
  height: 100px;
  padding: 0;
  background-color: rgba(216, 130, 84);
  border: 5px solid #D88254;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1700;
  opacity: ${(props) => (props.open ? 1 : 0)};
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  transition: opacity ${(props) => (props.open ? '1.0s ease-in-out' : '0s')}, visibility 0s ${(props) => (props.open ? '0s' : '1.0s')};
  animation: ${(props) => (props.open ? 'rotateIn 0.8s ease-in-out' : 'none')};

  box-sizing: border-box; /* 추가: 패딩 및 보더를 포함하여 크기 계산 */



  @media (max-width: 1920px) {
    z-index: 1600;
    left: -8%;
  }

  @media (max-width: 1000px) {
    z-index: 1600;
    left: -8%;
  }
  @media (max-width: 400px) {
  right: calc(42.5% - 100px); /* 기존 위치에서 30px 더 오른쪽으로 이동 */
  }

  .x-shape {
    width: 60%;
    height: 60%;
    position: relative;
    z-index: 1600;
  }

  .x-shape::before, .x-shape::after {
    content: '';
    position: absolute;
    width: 0;
    height: 5px;
    background-color: #14332C;
    top: 50%;
    left: 50%;
    transform-origin: center;
    transition: width 0.3s ease-in-out;
  }

  .x-shape::before {
    transform: translate(-50%, -50%) rotate(45deg);
    animation: drawXBefore 0.3s ease-in-out forwards;
    animation-delay: 0.3s;
    z-index: 1700;
  }

  .x-shape::after {
    transform: translate(-50%, -50%) rotate(-45deg);
    animation: drawXAfter 0.3s ease-in-out 0.15s forwards;
    animation-delay: 0.3s;
    z-index: 1700;
  }

  @keyframes drawXBefore {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  @keyframes drawXAfter {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  @keyframes rotateIn {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;


const Drawer = ({ open, onClose }) => {
  return (
    <>
      <DrawerContainer open={open}>
      <CloseButton
          className={CloseButton}
          open={open}
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="x-shape"></div>
        </CloseButton>
        <NavItem href="/" className="special-spacing-home">Home</NavItem>
        <NavItem href="/mypage" className="special-spacing">My Page</NavItem>
        <NavItem href="/hotel">Hotel</NavItem>
        <NavItem href="/treats">Shop</NavItem>
        <NavItem href="/board">Community</NavItem>
        <IconContainer className="navIcons">
          <a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </IconContainer>
      </DrawerContainer>
      <TopDrawerContainer open={open}>
      </TopDrawerContainer>
      <BottomDrawerContainer open={open}>
      
      </BottomDrawerContainer>
    </>
  );
};

export default Drawer;
