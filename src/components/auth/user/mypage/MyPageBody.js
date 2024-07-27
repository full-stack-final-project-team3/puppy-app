import React from 'react';
import AboutMe from "./AboutMe";
import AboutDog from "./AboutDog";
import { Link } from "react-router-dom";
import styles from "./MyPageBody.module.scss";

const MyPageBody = ({ user, dogList }) => {
    return (
        <div>
            <AboutMe user={user} />
            {dogList && dogList.length > 0 ? (
                <AboutDog dogList={dogList} />
            ) : (
                <div className={styles.add}>
                    <Link to={"/add-dog"} className={styles.addDog}>강아지 등록하기</Link>
                </div>
            )}
        </div>
    );
};

export default MyPageBody;