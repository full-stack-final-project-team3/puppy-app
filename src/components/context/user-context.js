import { createContext } from "react";

const UserContext = createContext({
    isLogin: false,
    changeIsLogin: () => {},
    user: "",
    setUser: () => {},
});

export default UserContext;