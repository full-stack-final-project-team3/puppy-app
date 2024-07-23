import React, { useState } from 'react';
import UserContext from './user-context';

const UserProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);

    const changeIsLogin = (status) => {
        setIsLogin(status);
    };

    return (
        <UserContext.Provider value={{
            isLogin,
            changeIsLogin
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;