import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visibleComponent: 'UserCount', // 초기 상태로 UserCount 컴포넌트 보이기
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setVisibleComponent: (state, action) => {
            state.visibleComponent = action.payload;
        }
    }
});

export const adminActions = adminSlice.actions;
export default adminSlice.reducer;