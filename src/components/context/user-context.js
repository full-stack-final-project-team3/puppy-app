import { createContext } from "react";

const UserContext = createContext({
    isLogin: false,
    changeIsLogin: () => {}
});

export default UserContext;