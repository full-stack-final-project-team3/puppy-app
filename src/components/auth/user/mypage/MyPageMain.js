import React, { useEffect, useState } from 'react';
import styles from './MyPageMain.module.scss';
import MyPageHeader from "./MyPageHeader";
import MyPageBody from "./MyPageBody";
import { useRouteLoaderData } from "react-router-dom";
import { AUTH_URL, DOG_URL } from "../../../../config/user/host-config";

const MyPageMain = () => {
    const userData = useRouteLoaderData('user-data2');
    const [userDetail, setUserDetail] = useState({});
    const [dogList, setDogList] = useState([]);

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
    }, [userData.email]);

    const { id } = userDetail;

    useEffect(() => {
        if (!id) return; // id가 없는 경우 요청을 보내지 않음

        const fetchData = async () => {
            try {
                const response = await fetch(`${DOG_URL}/user/${id}`);
                const userDetailData = await response.json();
                setDogList(userDetailData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className={styles.wrap}>
            <MyPageHeader />
            <MyPageBody user={userDetail} dogList={dogList} />
        </div>
    );
};

export default MyPageMain;