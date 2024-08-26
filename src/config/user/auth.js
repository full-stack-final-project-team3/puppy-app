
// 로그인한 유저의 정보 가져오기
import {redirect} from "react-router-dom";



const getUserData = () => {
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

// 인증 토큰만 가져오기
export const getUserToken = () => {
    const userData = getUserData();
    return userData && userData.token ? userData.token : null; // null 체크 후 token 가져오기
};

// 로그인 회원정보를 불러오는 loader
export const userDataLoader = () => {

    const userData = getUserData();

    return userData;
}

// 접근 권한을 확인하는 loader
export const authCheckLoader = () => {
    const userData = getUserData();
    if (!userData) {
        alert('로그인이 필요한 서비스입니다.')
        return redirect('/'); // 홈으로 돌려보냄
    }
    return userData; // 현재 페이지에 머묾
    // 이벤트에 최상위 router에 걸어준다. (EventLayout.js)
}