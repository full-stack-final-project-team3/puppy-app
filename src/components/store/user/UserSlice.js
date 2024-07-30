import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userInfo: {},

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => { // 유저 정보 저장
            state.userInfo = action.payload;
            let parse = JSON.parse(state.userInfo);
            console.log(parse)

        }
    }
})

export const userActions = userSlice.actions;
export default userSlice.reducer;