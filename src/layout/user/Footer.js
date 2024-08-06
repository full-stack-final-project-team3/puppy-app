import React from 'react';
import styles from './Footer.module.scss'

const Footer = () => {
    return (
        <footer className={styles.footerWrap}>
            <div className={styles.greenWrap}>
                <p className={styles.pTitle}>Maybe you are interested in our service. Maybe? 😀</p>
            </div>
            <div className={styles.orangeLine}></div>
            <div className={styles.mainWrap}>

            </div>
        </footer>
    );
};

export default Footer;