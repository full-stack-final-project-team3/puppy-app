import React, {useContext, useEffect, useState} from 'react';
import { useRouteLoaderData } from "react-router-dom";
import UserContext from "../../components/context/user-context";
import {AUTH_URL} from "../../config/user/host-config";

const WelcomePage = () => {

    const userData = useRouteLoaderData('user-data');


    const {changeIsLogin, user, setUser} = useContext(UserContext);
    useEffect(() => {
        if (userData) {
            changeIsLogin(true);

            const userDataJson = localStorage.getItem('userData');
            setUser(userData)
            // console.log(user)
        }
    }, [userData, changeIsLogin]); // 종속성 배열 추가

    const [userDetail, setUserDetail] = useState({});
    useEffect(() => {

        if (!userData) return;

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

    // console.log(userDetail)

    return (
        <>
            {user ? <div>Welcome {userDetail.nickname}~</div> : <div>Welcome ~</div>}
        </>
    );
};

export default WelcomePage;