import {redirect} from "react-router-dom";


export const logoutAction = () => {
    localStorage.removeItem('userData');

    return redirect('/')
};