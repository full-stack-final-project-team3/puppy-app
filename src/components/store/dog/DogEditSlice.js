import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    editMode: false, // 수정 모드 진입 여부
};

const dogEditSlice = createSlice({
    name: "dogEditMode",
    initialState: initialState,
    reducers: {
        startEdit(state) {
            state.editMode = true;
        },
        clearEdit(state) {
            state.editMode = false;
        }
    }
})

export const dogEditActions = dogEditSlice.actions;
export default dogEditSlice.reducer;