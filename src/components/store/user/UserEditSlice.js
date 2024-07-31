// userEditSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isEditMode: false,
    isUserEditMode: false,
    userDetail: JSON.parse(localStorage.getItem('userDetail')) || {} // 초기 상태를 로컬 저장소에서 불러옴
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
            localStorage.setItem('userDetail', JSON.stringify(state.userDetail)); // 로컬 저장소에 저장
        }
    }
});

export const userEditActions = userEditSlice.actions;
export default userEditSlice.reducer;