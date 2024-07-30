import React from 'react';
import styles from './AboutDog.module.scss';
import {Link} from "react-router-dom";
import DogList from "../../dog/DogList";

const AboutDog = ({ dogList }) => {

    return (
        <div className={styles.wrap}>
            <div className={styles.me}>My Dogs
                <div className={styles.add}>
                    <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                </div>
            </div>

            <div className={styles.container}>
                {dogList.map(dog => (
                    <DogList key={dog.id} dog={dog} />
                ))}
            </div>
        </div>
    );
};

export default AboutDog;