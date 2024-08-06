import React, { useContext, useEffect, useState } from 'react';
import { useRouteLoaderData } from "react-router-dom";
import UserContext from "../../components/context/user-context";
import { AUTH_URL } from "../../config/user/host-config";
import {useDispatch} from "react-redux";
import { userEditActions } from "../../components/store/user/UserEditSlice";
import Footer from '../../layout/user/Footer';
import Home from "../Home";

const WelcomePage = () => {
    const userData = useRouteLoaderData('user-data3');
    const dispatch = useDispatch();
    const { changeIsLogin, user, setUser } = useContext(UserContext);
    const [userDetail, setUserDetail] = useState({});

    // 로그인 상태 설정 및 사용자 데이터 설정
    useEffect(() => {
        if (userData) {
            changeIsLogin(true);
            setUser(userData);

            // 사용자 세부 정보 가져오기
            const fetchUserDetail = async () => {
                try {
                    const response = await fetch(`${AUTH_URL}/${userData.email}`);
                    if (response.ok) {
                        const userDetailData = await response.json();
                        dispatch(userEditActions.updateUserDetail(userDetailData));
                        setUserDetail(userDetailData);
                    } else {
                        console.error('Failed to fetch user details:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            };
            fetchUserDetail();
        }
    }, [userData, changeIsLogin, setUser, dispatch]);

    return (
        <div>
            {user ? <div>Welcome {userDetail.nickname}~</div> : <div>Welcome ~</div>}
            <Home /> {/* Home 컴포넌트를 렌더링 */}
            <Footer /> {/* Footer 컴포넌트를 렌더링 */}
        </div>
    );
};

export default WelcomePage;