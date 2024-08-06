import React from 'react';
import AboutMe from "./AboutMe";
import AboutDog from "./AboutDog";
import { Link } from "react-router-dom";
import styles from "./MyPageBody.module.scss";

const MyPageBody = ({ dogList }) => {
    return (
        <div className={styles.wrap}>
            <AboutMe />
            {dogList && dogList.length > 0 ? (
                <AboutDog dogList={dogList} />
            ) : (
                <div className={styles.subWrap}>
                    <div className={styles.me}>
                        <span className={styles.span}>My Dogs</span>
                        <div className={styles.add}>
                            <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPageBody;