import React from 'react';
import styles from './AboutMe.module.scss';


const AboutMe = ({ user }) => {



    return (
        <div className={styles.wrap}>
            <div>Me</div>
            <div className={styles.mainContainer}>
                <img className={styles.img} src={user.profileUrl}></img>
                <div>
                    <h3>{user.nickname}</h3>
                    <span>내 포인트 : {user.point}</span> <br/>
                    <button>수정</button>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;