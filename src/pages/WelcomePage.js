import React from 'react';
import {useRouteLoaderData} from "react-router-dom";

const WelcomePage = () => {

    const userData = useRouteLoaderData('user-data');



    return (
        <>
            <div>
                Welcome ~
            </div>
        </>


    );
};

export default WelcomePage;