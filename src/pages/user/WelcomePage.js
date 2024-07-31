import React, {useContext, useEffect, useState} from 'react';
import { useRouteLoaderData } from "react-router-dom";
import UserContext from "../../components/context/user-context";
import {AUTH_URL} from "../../config/user/host-config";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../../components/store/user/UserSlice";
import {userEditActions} from "../../components/store/user/UserEditSlice";

const WelcomePage = () => {

    const userData = useRouteLoaderData('user-data3');
    console.log(userData)

    let dispatch = useDispatch();


    // 리덕스 리팩토링 다시.

    // console.log(userData)
    const {changeIsLogin, user, setUser} = useContext(UserContext);
    useEffect(() => {
        if (userData) {
            changeIsLogin(true);

            const userDataJson = localStorage.getItem('userData');
            setUser(userData)
        }
    }, [userData, changeIsLogin]); // 종속성 배열 추가

    const [userDetail, setUserDetail] = useState({});
    useEffect(() => {

        if (!userData) return;

        const fetchData = async () => {
            try {
                const response = await fetch(`${AUTH_URL}/${userData.email}`);
                const userDetailData = await response.json();

                // dispatch(userActions.setUserInfo(userDetailData));
                dispatch(userEditActions.updateUserDetail(userDetailData));
                setUserDetail(userDetailData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);



    return (
        <>
            {user ? <div>Welcome {userDetail.nickname}~</div> : <div>Welcome ~</div>}
        </>
    );
};

export default WelcomePage;