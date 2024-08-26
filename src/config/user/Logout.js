// import React from 'react';
// import { useSelector } from 'react-redux';
// import { logoutAction } from '../../pages/user/Logout';
//
// const Logout = () => {
//     const userDetail = useSelector(state => state.userEdit.userDetail);
//
//     // userDetail이 존재할 때만 logoutAction 호출
//     if (userDetail) {
//         logoutAction(userDetail);
//     } else {
//         // 로그인되지 않은 상태에서 기본 로그아웃 처리
//         logoutAction();
//     }
//
//     return null;
// };
//
// export default Logout;