// import { redirect } from "react-router-dom";
// import { AUTH_URL } from "../../config/user/host-config";
// import { Cookies } from 'react-cookie';
//
// export const logoutAction = async (userDetail = {}) => {
//     const cookies = new Cookies();
//
//     try {
//         // 서버에 로그아웃 요청 보내기
//         const response = await fetch(`${AUTH_URL}/logout`, {
//             method: "POST",
//             credentials: 'include', // 쿠키를 포함하여 전송
//         });
//
//         if (response.ok) {
//             // 서버에서 쿠키를 삭제한 후 클라이언트에서도 쿠키 삭제 시도
//             cookies.remove('authToken', { path: '/', domain: 'localhost' }); // 도메인 설정 주의
//
//             // 로컬 스토리지 비우기
//             localStorage.removeItem('userData');
//             localStorage.removeItem('userDetail');
//
//             if (userDetail.provider !== "KAKAO") {
//                 localStorage.removeItem('provider');
//             }
//
//             return redirect('/');
//         } else {
//             console.error("로그아웃 실패:", await response.text());
//         }
//     } catch (error) {
//         console.error("로그아웃 중 오류 발생:", error);
//     }
// };