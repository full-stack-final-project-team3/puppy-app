import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: {},
    existNotice: false,
    noticeCount: 0
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => { // 유저 정보 저장
            state.userInfo = action.payload;
            let parse = JSON.parse(state.userInfo);
            console.log(parse)
        },
        setExistNotice: (state) => { // 유저가 구매, 예약 등 행위를 하면 true로 바꿔줌
            state.existNotice = true;
            state.noticeCount = state.noticeCount + 1;
        },
        clearExistNotice: (state) => {
            state.existNotice = false;
            state.noticeCount = 0;
        }
    }
})

export const userActions = userSlice.actions;
export default userSlice.reducer;