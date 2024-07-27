import React from 'react';
import styles from './AboutMe.module.scss';
import {Link} from "react-router-dom";


const AboutMe = ({ user }) => {



    return (
        <div className={styles.wrap}>
            <div className={styles.me}>Me</div>
            <div className={styles.mainContainer}>
                <img className={styles.img} src={user.profileUrl}></img>
                <div className={styles.wrapRight}>
                    <h3 className={styles.nickname}>{user.nickname}</h3>
                    <span className={styles.point}>내 포인트 : {user.point}</span> <br/>
                    <Link to={"/"} className={styles.modify}>수정</Link>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;