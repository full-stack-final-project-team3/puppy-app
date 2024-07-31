import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    isEditMode: false, // 수정 모드 진입 여부
    userEditMode: false,
    userDetail: {} // 사용자 정보
};

const userEditSlice = createSlice({
    name: "userEditMode",
    initialState: initialState,
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
            state.userDetail = action.payload; // 유저의 정보를 갖고 있는 redux
            console.log(state.userDetail);
        }
    }
})


export const userEditActions = userEditSlice.actions;
export default userEditSlice.reducer;