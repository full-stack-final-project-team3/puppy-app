import React, {useEffect, useState} from 'react';
import {Link, useRouteLoaderData} from "react-router-dom";
import styles from './AboutDog.module.scss';
import {DOG_URL} from "../../../../config/user/host-config";

const AboutDog = ({ dogList }) => {


    return (
        <>

            <div className={styles.wrap}>
                <div className={styles.me}>My Dogs</div>
                {dogList.map(dog => (<div key={dog.id} className={styles.mainContainer}>
                    <img className={styles.img} src={dog.dogProfileUrl}></img>
                    <div className={styles.wrapRight}>
                        <h3 className={styles.nickname}>{dog.dogName}</h3>
                        {/*<span className={styles.point}>내 포인트 : {user.point}</span> <br/>*/}
                        <button className={styles.modify}>수정(아직x)</button>
                    </div>
                </div>))}
            </div>

        </>
    );
};

export default AboutDog;