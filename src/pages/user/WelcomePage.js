import React from 'react';
import {useRouteLoaderData} from "react-router-dom";

const WelcomePage = () => {

    const userData = useRouteLoaderData('user-data');
    if (userData) console.log(userData)

    return (
        <>
            {userData ? <div>Welcome {userData.nickname}~</div> : <div>Welcome ~</div>}
        </>
    );
}

export default WelcomePage;