import {redirect} from "react-router-dom";


export const logoutAction = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userDetail');
    window.location.reload();
    return redirect('/')
};