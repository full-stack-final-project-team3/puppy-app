import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEditMode: false,
    isUserEditMode: false,
    userDetail: JSON.parse(localStorage.getItem('userDetail')) || JSON.parse(sessionStorage.getItem('userDetail')), // 초기 상태를 로컬 저장소에서 불러옴
    userNotice: [],
    userCookie: ''
};

const userEditSlice = createSlice({
    name: "userEditMode",
    initialState,
    reducers: {
        startMode(state) {
            state.isEditMode = true;
        },
        clearMode(state) {
            state.isEditMode = false;
        },
        startUserEditMode(state) {
            state.isUserEditMode = true;
        },
        clearUserEditMode(state) {
            state.isUserEditMode = false;
        },
        updateUserDetail(state, action) {
            state.userDetail = action.payload;

            // 자동 로그인 여부에 따라 로컬 스토리지 또는 세션 스토리지에 저장
            if (action.payload.autoLogin) {
                localStorage.setItem('userDetail', JSON.stringify(state.userDetail));
            } else if (!action.payload.autoLogin) {
                sessionStorage.setItem('userDetail', JSON.stringify(state.userDetail));
            }
        },
        saveUserNotice(state, action) {
            state.userNotice = action.payload;
        },
        addUserNotice(state, action) {
            state.userNotice.push(action.payload);
        },
        setUserCookie(state, action) {
            state.userCookie = action.payload;
        }
        // updateUserNotice(state, action) {
        //     const updatedNotice = state.userNotice.map(notice =>
        //         notice.id === action.payload.noticeId ? { ...notice, isClicked: true } : notice
        //     );
        //     state.userNotice = updatedNotice;
        // }
    }
});

export const userEditActions = userEditSlice.actions;
export default userEditSlice.reducer;