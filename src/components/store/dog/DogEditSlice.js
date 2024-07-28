import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    isDogEditMode: false, // 수정 모드 진입 여부
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
        }
    }
})

export const dogEditActions = dogEditSlice.actions;
export default dogEditSlice.reducer;