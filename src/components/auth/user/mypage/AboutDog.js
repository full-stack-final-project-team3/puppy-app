import React from 'react';
import styles from './AboutDog.module.scss';

const AboutDog = ({ dogList }) => {
    return (
        <div className={styles.wrap}>
            <div className={styles.me}>My Dogs</div>
            {dogList.map(dog => (
                <div key={dog.id} className={styles.mainContainer}>
                    <img className={styles.img} src={dog.dogProfileUrl}></img>
                    <div className={styles.wrapRight}>
                        <h3 className={styles.nickname}>{dog.dogName}</h3>
                        <button className={styles.modify}>수정(아직x)</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AboutDog;