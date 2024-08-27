// src/components/Drawer.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import styles from './Drawer.module.scss';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";

import spinnerStyles from "../../layout/user/Spinner.module.scss";


const DrawerContainer = styled(motion.div)`
  font-family: 'NotoSansKR';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  width: 440px;
  height: 100%;
  background-color: #14332C;
  z-index: 1400;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;

  @media (max-width: 400px) {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
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
  font-family: "Poppins";

  &:hover {
    color: #D88254;
  }

  &.special-spacing {
    margin-top: 100px; /* Home과 MyPage 사이의 간격을 40px로 증가 */
  }

  &.special-spacing-home {
    margin-top: 120px;
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


const TopDrawerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 135px;
  background-color: #14332C;
  z-index: 1000;
  @media (max-width: 768px) {
    height: 50%;
  }
`;

const BottomDrawerContainer = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 145px;
  background-color: #14332C;
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
    left: -10%;
  }

  @media (max-width: 1000px) {
    z-index: 1600;
    left: -8%;
  }
  @media (max-width: 400px) {
    right: calc(42.5% - 100px);
    top: 2%;
    right: 0 !important;
    left: 85%;
    width: 50px;
    height: 50px;
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

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate
  const drawerRef = useRef(null);

  const handleNavClick = async (path) => {
    setLoading(true); // 로딩 시작
    try {
      // 비동기 작업 또는 페이지 로딩 처리
      await new Promise(resolve => setTimeout(resolve, 1000)); // 실제 비동기 작업으로 대체 가능
      navigate(path); // 페이지 이동
      setTimeout(() => {
        onClose(); // 페이지 이동 후 Drawer 닫기
      }, 300); // navigate 후 약간의 딜레이 후 onClose 호출
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
   // 바탕화면 클릭 useRef, effect 사용하면 될듯?
  
   useEffect(() => {
    const handleClickOutside = (e) => {
        if (drawerRef.current && !drawerRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (open) {
        document.addEventListener('mousedown', handleClickOutside);
    } else {
        document.removeEventListener('mousedown', handleClickOutside);
    }

    // useEffect 가 실행 될때마다 이전값을 지우기 위해서 리턴문 사용했음 ㅇㅇ
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [open, onClose]);

  return (
    <>
    {loading && (
        <div className={styles.loadingOverlay}>
        <div className={spinnerStyles.spinnerContainer}>
          <PulseLoader
            className={spinnerStyles.loader}
            color="#0B593F" 
            loading={loading}
            size={18}
          />{" "}
        </div>
      </div>
      )}
      <DrawerContainer
        initial={{ x: '100%' }}  // Drawer가 화면 밖에 시작
        animate={{ x: open ? 0 : '100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 25 : 35,     // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
        open={open}
        ref={drawerRef}
        >
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
        <NavItem onClick={() => handleNavClick("/")} className="special-spacing-home">Home</NavItem>
        <NavItem onClick={() => handleNavClick("/mypage")} className="special-spacing">My Page</NavItem>
        <NavItem onClick={() => handleNavClick("/hotel")}>Hotel</NavItem>
        <NavItem onClick={() => handleNavClick("/treats")}>Shop</NavItem>
        <NavItem onClick={() => handleNavClick("/board")}>Community</NavItem>
        <IconContainer className="navIcons">
          <a href="mailto:example@example.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </IconContainer>
      </DrawerContainer>
      <TopDrawerContainer
        initial={{ y: '-100%' }}  // 위에서 시작
        animate={{ y: open ? 0 : '-100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 27 : 33,     // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
      open={open}>
      </TopDrawerContainer>
      <BottomDrawerContainer
        initial={{ y: '100%' }}  // 아래에서 시작
        animate={{ y: open ? 0 : '100%' }}  // 열리고 닫힐 때 위치 변화
        transition={{
          type: 'spring',  // inertia 대신 spring 사용
          stiffness: 180,  // 스프링의 강성도
          damping: open ? 27 : 33,      // 감쇠 비율
          mass: 1,         // 질량
          restDelta: 0.001,  // 애니메이션 종료 조건
        }}
        open={open}>
      </BottomDrawerContainer>
    </>
  );
};

export default Drawer;
