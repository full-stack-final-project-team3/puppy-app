
// 로그인한 유저의 정보 가져오기
import {redirect} from "react-router-dom";

const getUserData = () => {
    const userDataJson = localStorage.getItem('userData')
    return  JSON.parse(userDataJson);
};

// 인증 토큰만 가져오기
export const getUserToken = () => {
    // console.log(getUserData().token)
    return getUserData().token;
};

// 로그인 회원정보를 불러오는 loader
export const userDataLoader = () => {
    return getUserData();
}

// 접근 권한을 확인하는 loader
export const authCheckLoader = () => {
    const userData = getUserData();
    if (!userData) {
        alert('로그인이 필요한 서비스입니다.')
        return redirect('/'); // 홈으로 돌려보냄
    }
    return null; // 현재 페이지에 머묾
    // 이벤트에 최상위 router에 걸어준다. (EventLayout.js)
}