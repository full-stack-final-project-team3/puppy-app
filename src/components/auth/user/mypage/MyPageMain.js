import React, { useEffect, useState } from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import { useRouteLoaderData } from "react-router-dom";
import { AUTH_URL } from "../../../../config/user/host-config";

const MyPageMain = () => {

    const userData= useRouteLoaderData('user-data2');
    console.log(userData)
    const [userDetail, setUserDetail] = useState("");


    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`${AUTH_URL}/${userData.email}`);
                const userDetailData = await response.json();
                setUserDetail(userDetailData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);



    return (
        <div className={styles.wrap}>
            <MyPageHeader/>
            <MyPageBody user={userDetail}/>
        </div>
    );
};

export default MyPageMain;