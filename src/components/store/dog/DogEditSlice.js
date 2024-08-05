import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isDogEditMode: false, // 수정 모드 진입 여부
    dogInfo: {},
};

const dogEditSlice = createSlice({
    name: "dogEditMode",
    initialState: initialState,
    reducers: {
        startEdit(state) {
            state.isDogEditMode = true;
        },
        clearEdit(state) {
            state.isDogEditMode = false;
        },
        setDogInfo: (state, action) => { // 강아지 정보 저장
            state.dogInfo = action.payload;
        },
        updateDogInfo(state, action) {
            state.dogInfo = action.payload;
        },
    }
})

export const dogEditActions = dogEditSlice.actions;
export default dogEditSlice.reducer;