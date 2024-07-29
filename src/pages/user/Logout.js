import {redirect} from "react-router-dom";


export const logoutAction = () => {
    localStorage.removeItem('userData');
    window.location.reload();
    return redirect('/')
};