import React, { useState } from 'react';
import UserContext from './user-context';

const UserProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null)
    const changeIsLogin = () => {
        setIsLogin(true);
    };

    return (
        <UserContext.Provider value={{
            isLogin,
            changeIsLogin,
            user,
            setUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;