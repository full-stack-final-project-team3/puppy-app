import React from 'react';
import styles from './Footer.module.scss'
import {Facebook, FacebookOutlined, Instagram} from "@mui/icons-material";
import {BiLogoFacebook} from "react-icons/bi";
import {RiFacebookBoxLine} from "react-icons/ri";

const Footer = () => {
    return (
        <footer className={styles.footerWrap}>
            <div className={styles.greenWrap}>
                <p className={styles.pTitle}>© 2024 doggle. All rights reserved.</p>
            </div>
            <div className={styles.orangeLine}></div>
            <div className={styles.mainWrap}>
                <div className={styles.bottom}>
                    <div className={styles.innerWrap}>
                        <p>장소</p>
                        <p>서울특별시 관악구 봉천로 306</p>
                        <p>Seoul</p>
                        <p>08183</p>
                        <p className={styles.cursor}>Contact</p>
                        <p>041) 493-2044</p>
                        <p className={styles.cursor}>puppycompany@naver.com</p>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.innerWrap}>
                        <img  className={styles.img} src="/header-logo.png"/>
                        <div className={styles.snsLogo}>
                            <Facebook className={styles.icon}/>
                            <Instagram className={styles.icon}/>
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.innerWrap}>
                        <div className={styles.hours}>
                            <p>Hours</p>
                            <p>월요일 - 금요일</p>
                            <p>1 pm - 3 pm</p>
                        </div>
                        <div className={styles.holliday}>
                            <p>Weekends & Public Holidays</p>
                            <p>토요일 - 일요일</p>
                            <p>1 pm - 2 pm</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;