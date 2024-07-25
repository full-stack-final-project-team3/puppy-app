import React from 'react';
import AboutMe from "./AboutMe";

const MyPageBody = ({ user }) => {
    console.log(user)
    return (
        <div>
            <AboutMe user={user}/>
            {/*<AboutDog/>*/}
        </div>
    );
};

export default MyPageBody;