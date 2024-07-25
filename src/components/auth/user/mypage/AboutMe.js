import React from 'react';
import styles from './AboutMe.module.scss';


const AboutMe = ({ user }) => {



    return (
        <div className={styles.wrap}>
            <div className={styles.me}>Me</div>
            <div className={styles.mainContainer}>
                <img className={styles.img} src={user.profileUrl}></img>
                <div className={styles.wrapRight}>
                    <h3 className={styles.nickname}>{user.nickname}</h3>
                    <span className={styles.point}>내 포인트 : {user.point}</span> <br/>
                    <button className={styles.modify}>수정(아직x)</button>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;