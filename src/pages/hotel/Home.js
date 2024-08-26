import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { AUTH_URL } from '../../config/user/host-config';
import { Outlet } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { NOTICE_URL } from "../../config/user/host-config";
import { userEditActions } from "../../components/store/user/UserEditSlice";

const Home = () => {
    // const [cookies, setCookie, removeCookie] = useCookies(['authToken']);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     const authToken = cookies.authToken;
    //
    //     if (authToken) {
    //         const fetchData = async () => {
    //             try {
    //                 const firstResponse = await fetch(`${AUTH_URL}/auto-login`, {
    //                     method: "POST",
    //                     headers: {
    //                         Authorization: `Bearer ${authToken}`,
    //                         "Content-Type": "application/json",
    //                     },
    //                 });
    //
    //                 if (firstResponse.ok) {
    //                     const data = await firstResponse.json();
    //
    //                     const response = await fetch(`${AUTH_URL}/sign-in`, {
    //                         method: "POST",
    //                         headers: { "Content-Type": "application/json" },
    //                         body: JSON.stringify({
    //                             email: data.email,
    //                             password: data.password,
    //                             autoLogin: data.autoLogin,
    //                         }),
    //                     });
    //
    //                     if (response.ok) {
    //                         // const userDetailData = await (await fetch(`${AUTH_URL}/${data.email}`)).json();
    //                         // const noticeData = await (await fetch(`${NOTICE_URL}/user/${userDetailData.id}`)).json();
    //
    //                         // dispatch(userEditActions.saveUserNotice(noticeData));
    //                         // dispatch(userEditActions.updateUserDetail(userDetailData));
    //
    //                         // const responseData = await response.json();
    //                         // localStorage.setItem("userData", JSON.stringify(responseData));
    //
    //                         // if (userDetailData.provider === "KAKAO") {
    //                         //     localStorage.setItem('provider', 'kakao');
    //                         // }
    //                     } else {
    //                         removeCookie('authToken', { path: '/' });
    //                     }
    //                 } else {
    //                     removeCookie('authToken', { path: '/' });
    //                 }
    //             } catch (error) {
    //                 console.error("자동 로그인 중 오류 발생:", error);
    //                 removeCookie('authToken', { path: '/' });
    //             }
    //         };
    //
    //         fetchData();
    //     }
    // }, [cookies.authToken, dispatch, removeCookie]);

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default Home;