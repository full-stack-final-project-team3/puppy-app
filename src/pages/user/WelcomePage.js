import React, {useContext, useEffect} from 'react';
import { useRouteLoaderData } from "react-router-dom";
import UserContext from "../../components/context/user-context";

const WelcomePage = () => {

    const userData = useRouteLoaderData('user-data');
    if (userData) console.log(userData);
    const {changeIsLogin, user, setUser} = useContext(UserContext);
    useEffect(() => {
        if (userData) {
            changeIsLogin(true);

            const userDataJson = localStorage.getItem('userData');
            setUser(userData)
            console.log(user)
        }
    }, [userData, changeIsLogin]); // 종속성 배열 추가

    return (
        <>
            {user ? <div>Welcome {user.nickname}~</div> : <div>Welcome ~</div>}
        </>
    );
};

export default WelcomePage;